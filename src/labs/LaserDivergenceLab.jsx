import { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";

const LAMBDA = 650e-9; // He-Ne-like laser, 650nm
const W0 = 0.5e-3; // beam waist, 0.5mm (hidden "true" value)
const ZR = (Math.PI * W0 * W0) / LAMBDA; // Rayleigh range

function beamDiameterAt(z) {
  const w = W0 * Math.sqrt(1 + (z / ZR) ** 2);
  return 2 * w; // diameter in meters
}

export default function LaserDivergenceLab({ setPage }) {
  const [dist, setDist] = useState(1);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const diaMm = beamDiameterAt(dist) * 1000;

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, z: dist.toFixed(2), d: diaMm.toFixed(3) }]);
  const reset = () => setReadings([]);

  const computed = readings.length >= 2
    ? (() => {
        const a = readings[0], b = readings[readings.length - 1];
        const theta = (Number(b.d) - Number(a.d)) / (2 * (Number(b.z) - Number(a.z)) * 1000); // rad, d in mm -> m via /1000
        return theta;
      })()
    : null;

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit I &middot; photonics"
      title="Determination of divergence of a laser beam"
      aim="Aim: measure the laser beam diameter at two or more distances from the source, and use the change in diameter with distance to calculate the beam's divergence angle."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Beam profile at screen</p>
          <BeamSVG diaMm={diaMm} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Screen distance from laser <span className="mono" style={{ color: AMBER }}>{dist.toFixed(2)} m</span>
          </label>
          <input type="range" min="0.2" max="5" step="0.05" value={dist} onChange={e => setDist(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Beam diameter" value={`${diaMm.toFixed(3)} mm`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
          {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No readings recorded yet. Move the slider and record at least two distances.</p> : (
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: INK_SOFT }}><th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Distance z (m)</th><th style={{ padding: "4px 6px" }}>Diameter d (mm)</th></tr></thead>
              <tbody>{readings.map((r, i) => (
                <tr key={r.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}><td style={{ padding: "5px 6px" }}>{i + 1}</td><td style={{ padding: "5px 6px" }}>{r.z}</td><td style={{ padding: "5px 6px" }}>{r.d}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Divergence θ (from first & last reading)" value={computed !== null ? `${(computed * 1000).toFixed(3)} mrad` : "record ≥ 2 readings"} />
        </div>
        <VivaCheck
          question="As you move the screen farther from the laser, the beam diameter:"
          options={[["a", "Stays exactly constant forever"], ["b", "Gradually increases due to diffraction-driven divergence"], ["c", "Decreases"]]}
          correctKey="b"
          explanation="A real laser beam is never perfectly collimated — diffraction causes it to spread slowly as it propagates, which is exactly the divergence angle this experiment measures."
        />
      </>}
    />
  );
}

function BeamSVG({ diaMm }) {
  const r = Math.min(60, 6 + diaMm * 3);
  return (
    <svg viewBox="0 0 200 200" width="100%" height="180">
      <rect width="200" height="200" fill="#0F1D27" rx="8" />
      <circle cx="100" cy="100" r={r} fill={`rgba(217,137,31,0.25)`} stroke={AMBER} strokeWidth="1.5" />
      <circle cx="100" cy="100" r={Math.max(2, r * 0.3)} fill={AMBER} />
    </svg>
  );
}
