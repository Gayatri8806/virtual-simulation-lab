import { useState, useRef, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const I0 = 100; // arbitrary intensity units

export default function PolarizationLab({ setPage }) {
  const [angle, setAngle] = useState(30);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const rad = (angle * Math.PI) / 180;
  const intensity = I0 * Math.cos(rad) ** 2;

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, angle, cos2: Math.cos(rad) ** 2, intensity: intensity.toFixed(2) }]);
  const reset = () => setReadings([]);

  const chartData = useMemo(() => readings.map(r => ({ cos2: Number(r.cos2.toFixed(3)), intensity: Number(r.intensity) })), [readings]);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit III &middot; wave optics"
      title="Verification of Malus's law"
      aim="Aim: rotate the analyzer relative to a polarizer, record transmitted intensity at several angles, and verify that I = I₀cos²θ by plotting intensity against cos²θ."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Polarizer &rarr; analyzer</p>
          <PolarizerSVG angle={angle} intensity={intensity} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Analyzer angle θ <span className="mono" style={{ color: AMBER }}>{angle}°</span>
          </label>
          <input type="range" min="0" max="180" step="5" value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Transmitted intensity" value={intensity.toFixed(2)} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Intensity vs cos²θ</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="cos2" type="number" name="cos²θ" domain={[0, 1]} tick={{ fontSize: 12 }} label={{ value: "cos²θ", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis dataKey="intensity" type="number" name="I" tick={{ fontSize: 12 }} label={{ value: "Intensity", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {readings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>A straight line through the origin confirms Malus's law — try recording 5-6 angles.</p>}
        </div>
        <VivaCheck
          question="At what analyzer angle is the transmitted intensity zero?"
          options={[["a", "0°"], ["b", "45°"], ["c", "90°"]]}
          correctKey="c"
          explanation="I = I₀cos²θ is zero when cosθ = 0, i.e. θ = 90° — the analyzer is then crossed with the polarizer, blocking all light."
        />
      </>}
    />
  );
}

function PolarizerSVG({ angle, intensity }) {
  const glow = Math.min(1, intensity / I0);
  return (
    <svg viewBox="0 0 260 140" width="100%" height="130">
      <rect width="260" height="140" fill="#0F1D27" rx="8" />
      <circle cx="60" cy="70" r="4" fill={AMBER} />
      <line x1="15" y1="70" x2="105" y2="70" stroke="#7C93A3" strokeWidth="1.5" />
      <line x1="60" y1="40" x2="60" y2="100" stroke={AMBER} strokeWidth="2" />
      <text x="42" y="30" fill="#7C93A3" fontSize="9">polarizer</text>
      <g transform={`translate(160,70) rotate(${angle})`}>
        <line x1="0" y1="-30" x2="0" y2="30" stroke="#E24B3D" strokeWidth="2" />
      </g>
      <text x="140" y="30" fill="#7C93A3" fontSize="9">analyzer</text>
      <line x1="105" y1="70" x2="230" y2="70" stroke="#7C93A3" strokeWidth="1.5" />
      <circle cx="230" cy="70" r={3 + glow * 6} fill={`rgba(217,137,31,${0.2 + glow * 0.7})`} />
    </svg>
  );
}
