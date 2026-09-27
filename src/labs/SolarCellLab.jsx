import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const IS = 1e-10;
const N_IDEAL = 1.5;
const VT = 0.02585;
const AREA_CM2 = 4;
const INCIDENT_MW_PER_CM2 = 100;

function solarCurrent(v, il) {
  const i = il - IS * (Math.exp(v / (N_IDEAL * VT)) - 1);
  return i;
}

export default function SolarCellLab({ setPage }) {
  const [illumination, setIllumination] = useState(70);

  const il = (illumination / 100) * 0.03; // amps, short circuit-ish current scaled by illumination %

  const { curve, voc, isc, pmax, vmp, imp } = useMemo(() => {
    const pts = [];
    let voc = 0;
    for (let v = 0; v <= 0.7; v += 0.005) {
      const i = solarCurrent(v, il);
      if (i <= 0 && voc === 0) voc = v;
      pts.push({ v: Number(v.toFixed(3)), i: Math.max(i, 0) * 1000, p: Math.max(i, 0) * v * 1000 });
    }
    const isc = il * 1000;
    let best = pts[0];
    pts.forEach(p => { if (p.p > best.p) best = p; });
    return { curve: pts, voc, isc, pmax: best.p, vmp: best.v, imp: best.i };
  }, [il]);

  const ff = voc > 0 && isc > 0 ? pmax / (voc * isc) : 0;
  const incidentMw = INCIDENT_MW_PER_CM2 * AREA_CM2 * (illumination / 100);
  const efficiency = incidentMw > 0 ? (pmax / incidentMw) * 100 : 0;

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit IV &middot; semiconductor physics"
      title="I–V characteristics of a solar cell"
      aim="Aim: plot the current–voltage and power–voltage characteristics of a solar cell under illumination, and determine open-circuit voltage, short-circuit current, fill factor, and efficiency."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Illumination intensity <span className="mono" style={{ color: AMBER }}>{illumination}%</span>
          </label>
          <input type="range" min="10" max="100" step="5" value={illumination} onChange={e => setIllumination(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Higher illumination increases the photogenerated current, shifting the whole I-V curve upward.</p>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Readout label="Open-circuit voltage Voc" value={`${voc.toFixed(3)} V`} />
          <Readout label="Short-circuit current Isc" value={`${isc.toFixed(2)} mA`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>I–V and P–V characteristics</p>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={curve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="v" type="number" tick={{ fontSize: 12 }} label={{ value: "Voltage (V)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: "Current (mA)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: "Power (mW)", angle: 90, position: "insideRight", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="i" name="Current" stroke={TEAL_DARK} dot={false} strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="p" name="Power" stroke={AMBER} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
          <Readout label="Max power point" value={`${vmp.toFixed(2)} V, ${imp.toFixed(2)} mA`} />
          <Readout label="Fill factor" value={ff.toFixed(3)} />
          <Readout label="Efficiency" value={`${efficiency.toFixed(2)}%`} />
        </div>
        <VivaCheck
          question="Fill factor (FF) is a measure of:"
          options={[["a", "How square the I-V curve is — how close the max power point gets to Voc × Isc"], ["b", "The cell's physical fill (area covered by silicon)"], ["c", "The number of solar cells filled into a panel"]]}
          correctKey="a"
          explanation="FF = Pmax / (Voc × Isc). A perfectly 'square' I-V curve would give FF = 1; real cells are always less due to internal resistance, so FF quantifies how close to ideal the curve's knee is."
        />
      </>}
    />
  );
}
