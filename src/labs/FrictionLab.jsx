import { useState } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const MU_TRUE = 0.36; // hidden true coefficient of static friction
const THETA_REPOSE = (Math.atan(MU_TRUE) * 180) / Math.PI;

export default function FrictionLab({ setPage }) {
  const [angle, setAngle] = useState(10);

  const slipping = angle >= THETA_REPOSE;
  const muMeasured = Math.tan((angle * Math.PI) / 180);

  return (
    <MechLabShell
      setPage={setPage}
      unit="compulsory A3"
      title="Determination of coefficient of friction"
      aim="Aim: slowly tilt an inclined plane holding a block until it just begins to slide (the angle of repose), and use μ = tanθ to find the coefficient of static friction."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Incline angle θ <span className="mono" style={{ color: AMBER }}>{angle.toFixed(1)}°</span>
          </label>
          <input type="range" min="0" max="45" step="0.5" value={angle} onChange={e => setAngle(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Increase the angle slowly until the block just starts to slip.</p>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Block status" value={slipping ? "Slipping!" : "Static"} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Inclined plane</p>
          <InclineSVG angle={angle} slipping={slipping} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Angle of repose (at slip)" value={slipping ? `${angle.toFixed(1)}°` : "not yet reached"} />
          <Readout label="μ = tanθ" value={slipping ? muMeasured.toFixed(3) : "—"} />
        </div>
        <VivaCheck
          question="At the exact angle of repose, the block is:"
          options={[["a", "Already sliding fast"], ["b", "On the verge of sliding — friction force is at its maximum possible value"], ["c", "Completely unaffected by friction"]]}
          correctKey="b"
          explanation="At the angle of repose, the component of gravity along the incline exactly equals the maximum available static friction (μN) — any tiny increase in angle beyond this and the block slips."
        />
      </>}
    />
  );
}

function InclineSVG({ angle, slipping }) {
  const w = 280, h = 180;
  const baseY = 150, baseX1 = 30, baseX2 = 250;
  const rad = (angle * Math.PI) / 180;
  const topX = baseX1 + (baseX2 - baseX1) * Math.cos(rad);
  const topY = baseY - (baseX2 - baseX1) * Math.sin(rad);
  const blockPos = slipping ? 0.75 : 0.35;
  const blockX = baseX1 + (topX - baseX1) * blockPos;
  const blockY = baseY + (topY - baseY) * blockPos;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="170">
      <rect width={w} height={h} fill="#0F1D27" rx="8" />
      <polygon points={`${baseX1},${baseY} ${baseX2},${baseY} ${topX},${topY}`} fill="none" stroke="#5C7686" strokeWidth="2" />
      <rect x={blockX - 10} y={blockY - 14} width="20" height="14" fill={slipping ? "#E24B3D" : AMBER} transform={`rotate(${-angle} ${blockX} ${blockY})`} />
      <text x="8" y="20" fill="#7C93A3" fontSize="10">θ = {angle.toFixed(1)}°</text>
    </svg>
  );
}
