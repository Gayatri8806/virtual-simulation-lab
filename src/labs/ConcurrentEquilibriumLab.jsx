import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { AMBER, TEAL_DARK } from "../constants";

export default function ConcurrentEquilibriumLab({ setPage }) {
  const [f1, setF1] = useState({ mag: 35, angle: 30 });
  const [f2, setF2] = useState({ mag: 25, angle: 130 });

  const { equilibrantMag, equilibrantAngle, sumX, sumY } = useMemo(() => {
    const r1 = (f1.angle * Math.PI) / 180, r2 = (f2.angle * Math.PI) / 180;
    const x = f1.mag * Math.cos(r1) + f2.mag * Math.cos(r2);
    const y = f1.mag * Math.sin(r1) + f2.mag * Math.sin(r2);
    const mag = Math.sqrt(x * x + y * y);
    let angle = (Math.atan2(-y, -x) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return { equilibrantMag: mag, equilibrantAngle: angle, sumX: x, sumY: y };
  }, [f1, f2]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="graphical B1"
      title="Equilibrium of a concurrent force system"
      aim="Aim: given two known concurrent forces, find the third force (the equilibrant) that must be applied to keep the point in equilibrium — equal in magnitude, opposite in direction to their resultant."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Force 1</p>
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Magnitude <span className="mono" style={{ color: AMBER }}>{f1.mag} N</span></label>
          <input type="range" min="0" max="60" value={f1.mag} onChange={e => setF1({ ...f1, mag: Number(e.target.value) })} style={{ width: "100%" }} />
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Angle <span className="mono" style={{ color: AMBER }}>{f1.angle}°</span></label>
          <input type="range" min="0" max="359" value={f1.angle} onChange={e => setF1({ ...f1, angle: Number(e.target.value) })} style={{ width: "100%" }} />
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Force 2</p>
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Magnitude <span className="mono" style={{ color: AMBER }}>{f2.mag} N</span></label>
          <input type="range" min="0" max="60" value={f2.mag} onChange={e => setF2({ ...f2, mag: Number(e.target.value) })} style={{ width: "100%" }} />
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Angle <span className="mono" style={{ color: AMBER }}>{f2.angle}°</span></label>
          <input type="range" min="0" max="359" value={f2.angle} onChange={e => setF2({ ...f2, angle: Number(e.target.value) })} style={{ width: "100%" }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Force diagram</p>
          <ForceSVG f1={f1} f2={f2} eqMag={equilibrantMag} eqAngle={equilibrantAngle} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Equilibrant magnitude" value={`${equilibrantMag.toFixed(2)} N`} />
          <Readout label="Equilibrant direction" value={`${equilibrantAngle.toFixed(1)}°`} />
        </div>
        <VivaCheck
          question="The equilibrant of a force system is:"
          options={[["a", "The same as the resultant"], ["b", "Equal in magnitude to the resultant but opposite in direction"], ["c", "Always zero"]]}
          correctKey="b"
          explanation="The resultant is the single force equivalent to the whole system; the equilibrant is the one additional force needed to cancel it out — same magnitude, exactly reversed direction."
        />
      </>}
    />
  );
}

function ForceSVG({ f1, f2, eqMag, eqAngle }) {
  const cx = 140, cy = 140, scale = 1.6;
  const arrow = (mag, angle, color, label) => {
    const rad = (angle * Math.PI) / 180;
    const x2 = cx + mag * scale * Math.cos(rad);
    const y2 = cy - mag * scale * Math.sin(rad);
    return (
      <g key={label}>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x={x2 + 4} y={y2} fill={color} fontSize="10">{label}</text>
      </g>
    );
  };
  return (
    <svg viewBox="0 0 280 280" width="100%" height="260">
      <rect width="280" height="280" fill="#0F1D27" rx="8" />
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#7C93A3" />
        </marker>
      </defs>
      <circle cx={cx} cy={cy} r="3" fill="#7C93A3" />
      {arrow(f1.mag, f1.angle, TEAL_DARK, "F1")}
      {arrow(f2.mag, f2.angle, TEAL_DARK, "F2")}
      {arrow(eqMag, eqAngle, "#E24B3D", "Eq")}
    </svg>
  );
}
