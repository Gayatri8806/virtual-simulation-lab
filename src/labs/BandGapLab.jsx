import { useState, useRef, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V0_AT_25C = 0.65; // forward voltage at fixed current, 25°C
const SLOPE_MV_PER_C = 2.0; // typical ~2mV/°C decrease

function forwardVoltage(tempC) {
  return V0_AT_25C - (SLOPE_MV_PER_C / 1000) * (tempC - 25);
}

export default function BandGapLab({ setPage }) {
  const [temp, setTemp] = useState(25);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const v = forwardVoltage(temp);

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, t: temp, v: v.toFixed(4) }]);
  const reset = () => setReadings([]);

  const chartData = useMemo(() => readings.map(r => ({ t: r.t, v: Number(r.v) })), [readings]);

  const egEstimate = useMemo(() => {
    if (readings.length < 2) return null;
    const pts = readings.map(r => ({ x: r.t, y: Number(r.v) }));
    const n = pts.length;
    const sumX = pts.reduce((a, p) => a + p.x, 0);
    const sumY = pts.reduce((a, p) => a + p.y, 0);
    const sumXY = pts.reduce((a, p) => a + p.x * p.y, 0);
    const sumX2 = pts.reduce((a, p) => a + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return intercept; // V-intercept at T=0°C is close to Eg (in eV) for this simplified linear model
  }, [readings]);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit IV &middot; semiconductor physics"
      title="Band gap energy of a semiconductor (PN junction diode)"
      aim="Aim: measure the forward voltage of a diode (at fixed current) across a range of temperatures, and extrapolate the linear V–T trend back to find the band gap energy of the semiconductor."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Diode temperature <span className="mono" style={{ color: AMBER }}>{temp} °C</span>
          </label>
          <input type="range" min="25" max="85" step="1" value={temp} onChange={e => setTemp(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Forward voltage (fixed I)" value={`${v.toFixed(4)} V`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Forward voltage vs temperature</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="t" type="number" name="T" unit="°C" tick={{ fontSize: 12 }} label={{ value: "Temperature (°C)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis dataKey="v" type="number" name="V" domain={["dataMin - 0.02", "dataMax + 0.02"]} tick={{ fontSize: 12 }} label={{ value: "Vf (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {readings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Record voltage at several temperatures from 25°C to 85°C.</p>}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Extrapolated Eg (V-intercept at 0°C)" value={egEstimate !== null ? `${egEstimate.toFixed(3)} eV` : "record ≥ 2 points"} />
        </div>
        <VivaCheck
          question="Why does the forward voltage of a diode decrease as temperature rises?"
          options={[["a", "The diode starts conducting less current overall"], ["b", "Increasing thermal energy raises the intrinsic carrier concentration, so less applied voltage is needed to sustain the same current"], ["c", "It's a measurement artifact with no real physical cause"]]}
          correctKey="b"
          explanation="Higher temperature increases minority-carrier generation, effectively lowering the barrier voltage needed to maintain a given forward current — this is the basis of the classic ~2mV/°C diode temperature-sensing behavior."
        />
      </>}
    />
  );
}
