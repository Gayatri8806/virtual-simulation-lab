import { useState } from "react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function FiberNALab({ setPage }) {
  const [n1, setN1] = useState(1.48);
  const [n2, setN2] = useState(1.46);
  const [dist, setDist] = useState(10);

  const na = Math.sqrt(Math.max(n1 * n1 - n2 * n2, 0));
  const acceptanceDeg = (Math.asin(Math.min(na, 1)) * 180) / Math.PI;
  const criticalDeg = (Math.asin(n2 / n1) * 180) / Math.PI;
  const spotDiaCm = 2 * dist * Math.tan((acceptanceDeg * Math.PI) / 180);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit I &middot; photonics"
      title="Numerical aperture of an optical fiber"
      aim="Aim: compute the numerical aperture, acceptance angle, and critical angle of an optical fiber from its core and cladding refractive indices, and cross-check using the light-spot method."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Core index n1 <span className="mono" style={{ color: AMBER }}>{n1.toFixed(3)}</span>
          </label>
          <input type="range" min="1.44" max="1.52" step="0.001" value={n1} onChange={e => setN1(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            Cladding index n2 <span className="mono" style={{ color: AMBER }}>{n2.toFixed(3)}</span>
          </label>
          <input type="range" min="1.40" max={n1 - 0.001} step="0.001" value={Math.min(n2, n1 - 0.001)} onChange={e => setN2(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Screen distance (light-spot method) <span className="mono" style={{ color: AMBER }}>{dist} cm</span>
          </label>
          <input type="range" min="2" max="30" step="1" value={dist} onChange={e => setDist(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Predicted light-spot diameter on screen at this distance: <span className="mono">{spotDiaCm.toFixed(2)} cm</span></p>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Fiber cone diagram</p>
          <FiberSVG angleDeg={acceptanceDeg} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
          <Readout label="Numerical aperture" value={na.toFixed(4)} />
          <Readout label="Acceptance angle" value={`${acceptanceDeg.toFixed(2)}°`} />
          <Readout label="Critical angle" value={`${criticalDeg.toFixed(2)}°`} />
        </div>
        <VivaCheck
          question="Numerical aperture (NA) of a fiber tells you:"
          options={[["a", "The physical diameter of the fiber core"], ["b", "The cone of angles over which the fiber can accept and guide light"], ["c", "The signal loss per kilometer"]]}
          correctKey="b"
          explanation="NA = √(n1² − n2²) sets the maximum acceptance angle for light entering the fiber to still undergo total internal reflection — light outside this cone simply leaks out."
        />
      </>}
    />
  );
}

function FiberSVG({ angleDeg }) {
  const cx = 40, cy = 90;
  const len = 140;
  const rad = (angleDeg * Math.PI) / 180;
  const dy = len * Math.tan(rad);
  return (
    <svg viewBox="0 0 260 180" width="100%" height="170">
      <rect width="260" height="180" fill="#0F1D27" rx="8" />
      <rect x={cx} y={60} width={len} height={60} fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <line x1={cx} y1={cy - dy} x2={cx + len} y2={cy} stroke={AMBER} strokeWidth="1.5" />
      <line x1={cx} y1={cy + dy} x2={cx + len} y2={cy} stroke={AMBER} strokeWidth="1.5" />
      <line x1={cx} y1={cy} x2={cx + len} y2={cy} stroke="#7C93A3" strokeDasharray="3 3" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="3" fill={AMBER} />
      <text x="8" y="30" fill="#7C93A3" fontSize="10">acceptance cone</text>
    </svg>
  );
}
