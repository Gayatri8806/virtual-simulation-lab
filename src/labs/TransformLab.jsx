import { useState, useMemo } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const TRIANGLE = [[0, 0], [60, 0], [30, 50]];

function transform(points, { tx, ty, rot, sx, sy, shx }) {
  const rad = (rot * Math.PI) / 180;
  return points.map(([x, y]) => {
    // scale
    let px = x * sx, py = y * sy;
    // shear
    px = px + shx * py;
    // rotate
    const rx = px * Math.cos(rad) - py * Math.sin(rad);
    const ry = px * Math.sin(rad) + py * Math.cos(rad);
    // translate
    return [rx + tx, ry + ty];
  });
}

export default function TransformLab({ setPage }) {
  const [tx, setTx] = useState(40);
  const [ty, setTy] = useState(20);
  const [rot, setRot] = useState(0);
  const [scale, setScale] = useState(1);
  const [shx, setShx] = useState(0);

  const transformed = useMemo(() => transform(TRIANGLE, { tx, ty, rot, sx: scale, sy: scale, shx }), [tx, ty, rot, scale, shx]);

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group B &middot; graphics"
      title="2D transformations on a triangle"
      aim="Aim: apply translation, rotation, scaling, and shear to a triangle, and observe how each transformation matrix reshapes the original coordinates."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>Translate X <span className="mono" style={{ color: AMBER }}>{tx}</span></label>
          <input type="range" min="-50" max="150" value={tx} onChange={e => setTx(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 10 }}>Translate Y <span className="mono" style={{ color: AMBER }}>{ty}</span></label>
          <input type="range" min="-50" max="150" value={ty} onChange={e => setTy(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 10 }}>Rotate (°) <span className="mono" style={{ color: AMBER }}>{rot}</span></label>
          <input type="range" min="0" max="359" value={rot} onChange={e => setRot(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 10 }}>Scale <span className="mono" style={{ color: AMBER }}>{scale.toFixed(2)}×</span></label>
          <input type="range" min="0.3" max="2.5" step="0.05" value={scale} onChange={e => setScale(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 10 }}>Shear X <span className="mono" style={{ color: AMBER }}>{shx.toFixed(2)}</span></label>
          <input type="range" min="-1" max="1" step="0.05" value={shx} onChange={e => setShx(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Original (outline) vs transformed (filled)</p>
          <svg viewBox="0 0 300 220" width="100%" height="220" style={{ background: "#0F1D27", borderRadius: 8 }}>
            <polygon points={TRIANGLE.map(([x, y]) => `${x + 20},${200 - y}`).join(" ")} fill="none" stroke="#5C7686" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points={transformed.map(([x, y]) => `${x + 20},${200 - y}`).join(" ")} fill="rgba(217,137,31,0.4)" stroke={AMBER} strokeWidth="2" />
          </svg>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Transformed vertices</p>
          <div className="mono" style={{ fontSize: 12.5, color: TEAL_DARK }}>
            {transformed.map(([x, y], i) => <div key={i}>P{i + 1}: ({x.toFixed(1)}, {y.toFixed(1)})</div>)}
          </div>
        </div>
        <VivaCheck
          question="In this lab, why is scaling applied before rotation and translation in the transform order?"
          options={[["a", "Order never matters for 2D transformations"], ["b", "Transformation order matters — scaling around the origin first, then rotating, then translating, keeps the shape centered correctly instead of scaling it off in the wrong direction after it's moved", ], ["c", "It's required by the SVG format specifically"]]}
          correctKey="b"
          explanation="2D transformations are matrix multiplications, and matrix multiplication isn't commutative — the order changes the result. Scaling and rotating around the local origin first, then translating to the final position, is the standard convention that keeps shapes behaving predictably."
        />
      </>}
    />
  );
}
