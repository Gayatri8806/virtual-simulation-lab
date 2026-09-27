import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function TrussLab({ setPage }) {
  const [base, setBase] = useState(4);
  const [height, setHeight] = useState(3);
  const [load, setLoad] = useState(20);

  const { fAC, fBC, angle } = useMemo(() => {
    // Simple symmetric triangular truss: A --- B on ground, apex C loaded vertically downward.
    const halfBase = base / 2;
    const theta = Math.atan(height / halfBase); // angle of each sloping member to horizontal
    // At joint C: two members AC and BC support load P. By symmetry, vertical components share load equally.
    const forceInMember = load / (2 * Math.sin(theta));
    return { fAC: forceInMember, fBC: forceInMember, angle: (theta * 180) / Math.PI };
  }, [base, height, load]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="graphical B3"
      title="Forces in the members of a pin-jointed truss"
      aim="Aim: for a simple symmetric triangular truss loaded at the apex, use the method of joints to find the force in each sloping member, and state whether it's in tension or compression."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Base width <span className="mono" style={{ color: AMBER }}>{base} m</span></label>
          <input type="range" min="2" max="8" step="0.5" value={base} onChange={e => setBase(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>Height <span className="mono" style={{ color: AMBER }}>{height} m</span></label>
          <input type="range" min="1" max="6" step="0.5" value={height} onChange={e => setHeight(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>Apex load P <span className="mono" style={{ color: AMBER }}>{load} kN</span></label>
          <input type="range" min="0" max="60" step="1" value={load} onChange={e => setLoad(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Truss diagram</p>
          <TrussSVG base={base} height={height} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Force in AC (= BC by symmetry)" value={`${fAC.toFixed(2)} kN`} />
          <Readout label="Member angle to horizontal" value={`${angle.toFixed(1)}°`} />
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>Both sloping members are in compression — they push outward and downward to support the apex load, like two legs of an A-frame.</p>
        <VivaCheck
          question="In the method of joints, at each joint you apply:"
          options={[["a", "Only ΣM = 0"], ["b", "ΣFx = 0 and ΣFy = 0 — force equilibrium in two directions"], ["c", "Only the polygon law"]]}
          correctKey="b"
          explanation="Since each joint in a truss is treated as a point where concurrent forces meet, equilibrium requires the sum of forces in both the horizontal and vertical directions to be zero at every joint."
        />
      </>}
    />
  );
}

function TrussSVG({ base, height }) {
  const w = 280, margin = 30;
  const scaleX = (w - 2 * margin) / base;
  const scaleY = 120 / height;
  const scale = Math.min(scaleX, scaleY);
  const baseY = 140;
  const ax = margin, bx = margin + base * scale, apexX = margin + (base * scale) / 2, apexY = baseY - height * scale;
  return (
    <svg viewBox={`0 0 ${w} 160`} width="100%" height="150">
      <rect width={w} height="160" fill="#0F1D27" rx="8" />
      <line x1={ax} y1={baseY} x2={bx} y2={baseY} stroke="#7C93A3" strokeWidth="2" />
      <line x1={ax} y1={baseY} x2={apexX} y2={apexY} stroke={TEAL_DARK} strokeWidth="2.5" />
      <line x1={bx} y1={baseY} x2={apexX} y2={apexY} stroke={TEAL_DARK} strokeWidth="2.5" />
      <circle cx={ax} cy={baseY} r="4" fill={AMBER} />
      <circle cx={bx} cy={baseY} r="4" fill={AMBER} />
      <circle cx={apexX} cy={apexY} r="4" fill={AMBER} />
      <line x1={apexX} y1={apexY} x2={apexX} y2={apexY + 30} stroke="#E24B3D" strokeWidth="2" />
      <text x={apexX + 6} y={apexY + 20} fill="#E24B3D" fontSize="9">P</text>
      <text x={ax - 6} y={baseY + 16} fill="#7C93A3" fontSize="9">A</text>
      <text x={bx - 6} y={baseY + 16} fill="#7C93A3" fontSize="9">B</text>
      <text x={apexX - 6} y={apexY - 8} fill="#7C93A3" fontSize="9">C</text>
    </svg>
  );
}
