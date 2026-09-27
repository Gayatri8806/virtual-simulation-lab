import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const DEFAULT_FORCES = [
  { mag: 40, angle: 0 },
  { mag: 30, angle: 70 },
  { mag: 25, angle: 150 },
  { mag: 20, angle: 250 },
];

export default function PolygonForcesLab({ setPage }) {
  const [forces, setForces] = useState(DEFAULT_FORCES);

  const updateForce = (i, field, val) => {
    setForces(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  };

  const { points, resultantMag, resultantAngle } = useMemo(() => {
    let x = 0, y = 0;
    const pts = [{ x, y }];
    forces.forEach(f => {
      const rad = (f.angle * Math.PI) / 180;
      x += f.mag * Math.cos(rad);
      y += f.mag * Math.sin(rad);
      pts.push({ x, y });
    });
    const mag = Math.sqrt(x * x + y * y);
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return { points: pts, resultantMag: mag, resultantAngle: angle < 0 ? angle + 360 : angle };
  }, [forces]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="compulsory A1"
      title="Verification of the polygon law of forces"
      aim="Aim: draw concurrent forces tip-to-tail to scale (a force polygon) and find their resultant — the closing side of the polygon — and compare it with the analytical vector sum."
      controls={<>
        {forces.map((f, i) => (
          <div key={i} className="card">
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Force {i + 1}</p>
            <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Magnitude <span className="mono" style={{ color: AMBER }}>{f.mag} N</span></label>
            <input type="range" min="0" max="60" step="1" value={f.mag} onChange={e => updateForce(i, "mag", Number(e.target.value))} style={{ width: "100%" }} />
            <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Angle <span className="mono" style={{ color: AMBER }}>{f.angle}°</span></label>
            <input type="range" min="0" max="359" step="1" value={f.angle} onChange={e => updateForce(i, "angle", Number(e.target.value))} style={{ width: "100%" }} />
          </div>
        ))}
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Force polygon (tip to tail)</p>
          <PolygonSVG points={points} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Resultant magnitude" value={`${resultantMag.toFixed(2)} N`} />
          <Readout label="Resultant direction" value={`${resultantAngle.toFixed(1)}°`} />
        </div>
        <VivaCheck
          question="In the force polygon method, if the forces are in equilibrium, the polygon should:"
          options={[["a", "Never close — always leave a gap"], ["b", "Close completely, ending where it started"], ["c", "Form a perfect circle"]]}
          correctKey="b"
          explanation="When a system of concurrent forces is in equilibrium, their vector sum is zero — so drawing them tip-to-tail brings you exactly back to the starting point, closing the polygon."
        />
      </>}
    />
  );
}

function PolygonSVG({ points }) {
  const allX = points.map(p => p.x), allY = points.map(p => p.y);
  const minX = Math.min(...allX, 0), maxX = Math.max(...allX, 0);
  const minY = Math.min(...allY, 0), maxY = Math.max(...allY, 0);
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const pad = 20, size = 280;
  const scale = Math.min((size - 2 * pad) / w, (size - 2 * pad) / h);
  const toSvg = (p) => ({
    x: pad + (p.x - minX) * scale,
    y: size - pad - (p.y - minY) * scale,
  });
  const svgPts = points.map(toSvg);
  const path = svgPts.map(p => `${p.x},${p.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="280">
      <rect width={size} height={size} fill="#0F1D27" rx="8" />
      <polyline points={path} fill="none" stroke={TEAL_DARK} strokeWidth="2" />
      {svgPts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={AMBER} />)}
      <line x1={svgPts[0].x} y1={svgPts[0].y} x2={svgPts[svgPts.length - 1].x} y2={svgPts[svgPts.length - 1].y} stroke="#E24B3D" strokeWidth="1.5" strokeDasharray="4 3" />
      <text x="8" y="16" fill="#7C93A3" fontSize="9">dashed = closing side (resultant)</text>
    </svg>
  );
}
