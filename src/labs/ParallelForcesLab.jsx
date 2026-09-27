import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { AMBER, TEAL_DARK } from "../constants";

export default function ParallelForcesLab({ setPage }) {
  const [beamLen, setBeamLen] = useState(8);
  const [forces, setForces] = useState([
    { mag: 20, pos: 1 },
    { mag: 35, pos: 4 },
    { mag: 15, pos: 7 },
  ]);

  const updateForce = (i, field, val) => setForces(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));

  const { resultant, location } = useMemo(() => {
    const sum = forces.reduce((a, f) => a + f.mag, 0);
    const moment = forces.reduce((a, f) => a + f.mag * f.pos, 0);
    return { resultant: sum, location: sum > 0 ? moment / sum : 0 };
  }, [forces]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="graphical B2"
      title="Equilibrium of a parallel force system"
      aim="Aim: for several parallel (vertical) forces acting on a beam, find the magnitude of their resultant and the position along the beam where it acts."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Beam length <span className="mono" style={{ color: AMBER }}>{beamLen} m</span></label>
          <input type="range" min="4" max="12" step="0.5" value={beamLen} onChange={e => setBeamLen(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
        {forces.map((f, i) => (
          <div key={i} className="card">
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Force {i + 1}</p>
            <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Magnitude <span className="mono" style={{ color: AMBER }}>{f.mag} N</span></label>
            <input type="range" min="0" max="60" value={f.mag} onChange={e => updateForce(i, "mag", Number(e.target.value))} style={{ width: "100%" }} />
            <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Position <span className="mono" style={{ color: AMBER }}>{f.pos} m</span></label>
            <input type="range" min="0" max={beamLen} step="0.5" value={Math.min(f.pos, beamLen)} onChange={e => updateForce(i, "pos", Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        ))}
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Beam with parallel loads</p>
          <ParallelSVG beamLen={beamLen} forces={forces} location={location} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Resultant" value={`${resultant.toFixed(1)} N`} />
          <Readout label="Location from left end" value={`${location.toFixed(2)} m`} />
        </div>
        <VivaCheck
          question="The location of the resultant of parallel forces is found using:"
          options={[["a", "The average of all the force magnitudes"], ["b", "Varignon's theorem — the moment of the resultant equals the sum of moments of individual forces"], ["c", "Guesswork based on the diagram"]]}
          correctKey="b"
          explanation="Varignon's theorem states the moment of a resultant about any point equals the algebraic sum of moments of its components — used here to solve for the resultant's line of action."
        />
      </>}
    />
  );
}

function ParallelSVG({ beamLen, forces, location }) {
  const w = 280, margin = 20;
  const scale = (w - 2 * margin) / beamLen;
  const beamY = 90;
  return (
    <svg viewBox={`0 0 ${w} 160`} width="100%" height="150">
      <rect width={w} height="160" fill="#0F1D27" rx="8" />
      <line x1={margin} y1={beamY} x2={w - margin} y2={beamY} stroke="#7C93A3" strokeWidth="4" />
      {forces.map((f, i) => {
        const x = margin + f.pos * scale;
        return (
          <g key={i}>
            <line x1={x} y1={beamY - 40} x2={x} y2={beamY} stroke={TEAL_DARK} strokeWidth="2" />
            <text x={x - 8} y={beamY - 45} fill={TEAL_DARK} fontSize="9">{f.mag}N</text>
          </g>
        );
      })}
      <line x1={margin + location * scale} y1={beamY + 5} x2={margin + location * scale} y2={beamY + 35} stroke={AMBER} strokeWidth="2" strokeDasharray="3 3" />
      <text x={margin + location * scale - 10} y={beamY + 48} fill={AMBER} fontSize="9">resultant</text>
    </svg>
  );
}
