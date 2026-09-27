import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { AMBER, TEAL_DARK } from "../constants";

export default function BeamReactionLab({ setPage }) {
  const [length, setLength] = useState(6);
  const [pointLoad, setPointLoad] = useState(20);
  const [loadPos, setLoadPos] = useState(2);
  const [udl, setUdl] = useState(5);

  const { ra, rb } = useMemo(() => {
    const udlTotal = udl * length;
    const udlCentroid = length / 2;
    const sumMomentsAboutA = pointLoad * loadPos + udlTotal * udlCentroid;
    const rb = sumMomentsAboutA / length;
    const ra = pointLoad + udlTotal - rb;
    return { ra, rb };
  }, [length, pointLoad, loadPos, udl]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="compulsory A2"
      title="Support reactions of a simply supported beam"
      aim="Aim: for a simply supported beam carrying a point load and a uniformly distributed load, find the support reactions RA and RB using ΣM = 0 and ΣFy = 0."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Beam length L <span className="mono" style={{ color: AMBER }}>{length} m</span></label>
          <input type="range" min="3" max="10" step="0.5" value={length} onChange={e => setLength(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>Point load W <span className="mono" style={{ color: AMBER }}>{pointLoad} kN</span></label>
          <input type="range" min="0" max="50" step="1" value={pointLoad} onChange={e => setPointLoad(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>Load position from A <span className="mono" style={{ color: AMBER }}>{loadPos} m</span></label>
          <input type="range" min="0" max={length} step="0.5" value={Math.min(loadPos, length)} onChange={e => setLoadPos(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>UDL w (over full span) <span className="mono" style={{ color: AMBER }}>{udl} kN/m</span></label>
          <input type="range" min="0" max="15" step="0.5" value={udl} onChange={e => setUdl(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Beam diagram</p>
          <BeamSVG length={length} pointLoad={pointLoad} loadPos={loadPos} udl={udl} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="RA" value={`${ra.toFixed(2)} kN`} />
          <Readout label="RB" value={`${rb.toFixed(2)} kN`} />
        </div>
        <p style={{ fontSize: 12, color: "#42566A", textAlign: "center" }}>Check: RA + RB should equal total load = {(pointLoad + udl * length).toFixed(2)} kN</p>
        <VivaCheck
          question="Why do we take moments about support A to find RB?"
          options={[["a", "It's just convention, no real reason"], ["b", "Taking moments about A eliminates RA from the equation, leaving only RB to solve for"], ["c", "Because A always carries more load"]]}
          correctKey="b"
          explanation="RA acts at point A, so it has zero moment arm about A — taking ΣM_A = 0 removes RA entirely from that equation, letting you solve directly for RB."
        />
      </>}
    />
  );
}

function BeamSVG({ length, pointLoad, loadPos, udl }) {
  const w = 280, margin = 20;
  const scale = (w - 2 * margin) / length;
  const beamY = 100;
  const loadX = margin + loadPos * scale;
  return (
    <svg viewBox={`0 0 ${w} 160`} width="100%" height="150">
      <rect width={w} height="160" fill="#0F1D27" rx="8" />
      <line x1={margin} y1={beamY} x2={w - margin} y2={beamY} stroke="#7C93A3" strokeWidth="4" />
      <polygon points={`${margin - 8},${beamY + 20} ${margin + 8},${beamY + 20} ${margin},${beamY}`} fill={TEAL_DARK} />
      <circle cx={w - margin} cy={beamY + 14} r="6" fill={TEAL_DARK} />
      <text x={margin - 4} y={beamY + 35} fill="#7C93A3" fontSize="9">A</text>
      <text x={w - margin - 4} y={beamY + 35} fill="#7C93A3" fontSize="9">B</text>
      {pointLoad > 0 && (
        <>
          <line x1={loadX} y1={beamY - 40} x2={loadX} y2={beamY} stroke={AMBER} strokeWidth="2" markerEnd="url(#arrow)" />
          <text x={loadX - 10} y={beamY - 45} fill={AMBER} fontSize="9">{pointLoad}kN</text>
        </>
      )}
      {udl > 0 && Array.from({ length: 8 }).map((_, i) => {
        const x = margin + (i + 0.5) * ((w - 2 * margin) / 8);
        return <line key={i} x1={x} y1={beamY - 20} x2={x} y2={beamY - 3} stroke="#E24B3D" strokeWidth="1.5" />;
      })}
      <defs>
        <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={AMBER} />
        </marker>
      </defs>
    </svg>
  );
}
