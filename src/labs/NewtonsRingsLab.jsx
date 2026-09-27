import { useState, useRef, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const LAMBDA_NM = 589.3; // sodium D-line
const R_TRUE_CM = 100; // hidden "true" radius of curvature of the plano-convex lens

function diameterMm(n, rCm) {
  // D_n^2 = 4 n lambda R  (all in consistent units, convert to mm)
  const lambdaCm = LAMBDA_NM * 1e-7;
  const d2 = 4 * n * lambdaCm * rCm;
  return Math.sqrt(d2) * 10; // cm -> mm
}

export default function NewtonsRingsLab({ setPage }) {
  const [ringN, setRingN] = useState(5);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const dia = diameterMm(ringN, R_TRUE_CM);

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, n: ringN, d: dia.toFixed(3) }]);
  const reset = () => setReadings([]);

  const rEstimate = useMemo(() => {
    if (readings.length < 2) return null;
    const a = readings[0], b = readings[readings.length - 1];
    const dn2 = Number(a.d) ** 2, dm2 = Number(b.d) ** 2;
    const lambdaCm = LAMBDA_NM * 1e-7;
    const r = Math.abs(dn2 - dm2) / (4 * lambdaCm * Math.abs(a.n - b.n)) / 100; // mm^2 -> cm^2 factor /100
    return r;
  }, [readings]);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit III &middot; wave optics"
      title="Newton's rings — radius of curvature of a plano-convex lens"
      aim="Aim: observe the Newton's rings interference pattern, measure ring diameters at different ring numbers, and use D_n² = 4nλR to determine the radius of curvature R of the lens."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Ring pattern (sodium light, λ = 589.3 nm)</p>
          <RingsSVG />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Ring number n <span className="mono" style={{ color: AMBER }}>{ringN}</span>
          </label>
          <input type="range" min="2" max="15" step="1" value={ringN} onChange={e => setRingN(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Measure & record diameter</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Diameter D_n" value={`${dia.toFixed(3)} mm`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
          {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>Record diameters for at least two different ring numbers.</p> : (
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: INK_SOFT }}><th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Ring n</th><th style={{ padding: "4px 6px" }}>D_n (mm)</th><th style={{ padding: "4px 6px" }}>D_n² (mm²)</th></tr></thead>
              <tbody>{readings.map((r, i) => (
                <tr key={r.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}><td style={{ padding: "5px 6px" }}>{i + 1}</td><td style={{ padding: "5px 6px" }}>{r.n}</td><td style={{ padding: "5px 6px" }}>{r.d}</td><td style={{ padding: "5px 6px" }}>{(Number(r.d) ** 2).toFixed(2)}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Radius of curvature R" value={rEstimate !== null ? `${rEstimate.toFixed(1)} cm` : "record ≥ 2 rings"} />
        </div>
        <VivaCheck
          question="Why is the center of the Newton's rings pattern dark (in reflected light)?"
          options={[["a", "No light reaches the center"], ["b", "Zero air-gap thickness there causes destructive interference (plus a π phase shift at one reflecting surface)"], ["c", "The lens absorbs light at the center"]]}
          correctKey="b"
          explanation="At the point of contact between the lens and glass plate, the air-film thickness is zero. Combined with the phase reversal on reflection from the denser glass surface, this produces destructive interference — a dark center spot."
        />
      </>}
    />
  );
}

function RingsSVG() {
  const rings = [1, 2, 3, 4, 5, 6, 7].map(n => 12 * Math.sqrt(n));
  return (
    <svg viewBox="0 0 200 200" width="100%" height="180">
      <rect width="200" height="200" fill="#0F1D27" rx="8" />
      {rings.map((r, i) => (
        <circle key={i} cx="100" cy="100" r={r} fill="none" stroke={AMBER} strokeWidth="1.3" opacity={0.85 - i * 0.08} />
      ))}
      <circle cx="100" cy="100" r="3" fill="#0F1D27" stroke="#0F1D27" />
    </svg>
  );
}
