import { useState, useRef, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const H_TRUE = 6.626e-34;
const E_CHARGE = 1.602e-19;
const C = 3e8;
const WORK_FN = 1.9; // eV, effective work function offset for this LED-analog setup

const LEDS = [
  { name: "Violet", wavelength: 405, color: "#7B2FF7" },
  { name: "Blue", wavelength: 470, color: "#2F6FF7" },
  { name: "Green", wavelength: 525, color: "#2FB86B" },
  { name: "Yellow", wavelength: 590, color: "#E8C93D" },
  { name: "Red", wavelength: 650, color: "#E24B3D" },
];

function stoppingVoltage(wavelengthNm) {
  const freq = C / (wavelengthNm * 1e-9);
  const energyEv = (H_TRUE * freq) / E_CHARGE;
  return Math.max(energyEv - WORK_FN, 0);
}

export default function PlanckConstantLab({ setPage }) {
  const [ledIdx, setLedIdx] = useState(2);
  const [voltage, setVoltage] = useState(0);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const led = LEDS[ledIdx];
  const vStopTrue = stoppingVoltage(led.wavelength);
  const current = Math.max(0, 1 - voltage / (vStopTrue || 0.01));
  const freqTHz = (C / (led.wavelength * 1e-9)) / 1e12;

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, color: led.name, wl: led.wavelength, freq: freqTHz.toFixed(1), vstop: vStopTrue.toFixed(3) }]);
  const reset = () => setReadings([]);

  const chartData = useMemo(() => readings.map(r => ({ freq: Number(r.freq), vstop: Number(r.vstop) })), [readings]);

  const hEstimate = useMemo(() => {
    if (readings.length < 2) return null;
    const pts = readings.map(r => ({ x: Number(r.freq) * 1e12, y: Number(r.vstop) }));
    const n = pts.length;
    const sumX = pts.reduce((a, p) => a + p.x, 0);
    const sumY = pts.reduce((a, p) => a + p.y, 0);
    const sumXY = pts.reduce((a, p) => a + p.x * p.y, 0);
    const sumX2 = pts.reduce((a, p) => a + p.x * p.x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope * E_CHARGE;
  }, [readings]);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit II &middot; quantum physics"
      title="Determination of Planck's constant"
      aim="Aim: for several LED colors (frequencies), find the stopping voltage at which the photocurrent drops to zero, then use the slope of stopping voltage vs frequency to determine Planck's constant h."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>LED color</label>
          <select className="field" style={{ marginTop: 6 }} value={ledIdx} onChange={e => { setLedIdx(Number(e.target.value)); setVoltage(0); }}>
            {LEDS.map((l, i) => <option key={l.name} value={i}>{l.name} ({l.wavelength} nm)</option>)}
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            Retarding voltage <span className="mono" style={{ color: AMBER }}>{voltage.toFixed(3)} V</span>
          </label>
          <input type="range" min="0" max="2" step="0.005" value={voltage} onChange={e => setVoltage(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Increase the voltage until the photocurrent below reads ~0 — that's your stopping voltage for this color.</p>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Photocurrent" value={current.toFixed(3)} />
          <Readout label="LED" value={led.name} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record stopping voltage</button>
          <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Stopping voltage vs frequency</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="freq" type="number" name="freq" unit=" THz" tick={{ fontSize: 12 }} label={{ value: "Frequency (THz)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis dataKey="vstop" type="number" name="Vstop" unit=" V" tick={{ fontSize: 12 }} label={{ value: "Stopping voltage (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="h (from slope × e)" value={hEstimate ? `${hEstimate.toExponential(3)} J·s` : "record ≥ 2 colors"} />
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>Accepted value: h = 6.626 × 10⁻³⁴ J·s</p>
        <VivaCheck
          question="Why does the stopping voltage increase for higher-frequency (bluer) light?"
          options={[["a", "Blue light is brighter"], ["b", "Higher-frequency photons carry more energy (E = hν), giving ejected electrons more kinetic energy to overcome"], ["c", "Blue LEDs draw more current"]]}
          correctKey="b"
          explanation="Each photon's energy is hν — higher frequency means higher photon energy, so the ejected electrons have more kinetic energy and need a larger retarding voltage to be stopped."
        />
      </>}
    />
  );
}
