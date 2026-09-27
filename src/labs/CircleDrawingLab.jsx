import { useState, useMemo } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import PixelGrid from "./oopcg/PixelGrid";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

function reflect8(cx, cy, x, y, out) {
  out.push([cx + x, cy + y], [cx - x, cy + y], [cx + x, cy - y], [cx - x, cy - y]);
  out.push([cx + y, cy + x], [cx - y, cy + x], [cx + y, cy - x], [cx - y, cy - x]);
}

function midpointCircle(cx, cy, r) {
  const pts = [];
  let x = 0, y = r, d = 1 - r;
  reflect8(cx, cy, x, y, pts);
  while (x < y) {
    x++;
    if (d < 0) d += 2 * x + 1;
    else { y--; d += 2 * (x - y) + 1; }
    reflect8(cx, cy, x, y, pts);
  }
  return pts;
}

function ddaCircle(cx, cy, r) {
  const pts = [];
  const steps = Math.round(r * 4);
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * 2 * Math.PI;
    pts.push([Math.round(cx + r * Math.cos(theta)), Math.round(cy + r * Math.sin(theta))]);
  }
  return pts;
}

export default function CircleDrawingLab({ setPage }) {
  const [cx, setCx] = useState(10), [cy, setCy] = useState(10);
  const [r, setR] = useState(7);
  const [algo, setAlgo] = useState("midpoint");

  const pixels = useMemo(() => algo === "midpoint" ? midpointCircle(cx, cy, r) : ddaCircle(cx, cy, r), [cx, cy, r, algo]);

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group B &middot; graphics"
      title="Circle drawing algorithms"
      aim="Aim: draw a circle on a pixel grid using the trigonometric (DDA-style) method and the Midpoint circle algorithm, which uses 8-way symmetry and only integer arithmetic per octant."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Algorithm</label>
          <select className="field" style={{ marginTop: 6 }} value={algo} onChange={e => setAlgo(e.target.value)}>
            <option value="midpoint">Midpoint circle algorithm</option>
            <option value="dda">Trigonometric (DDA-style)</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            Radius <span className="mono" style={{ color: AMBER }}>{r}</span>
          </label>
          <input type="range" min="2" max="9" value={r} onChange={e => setR(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Center (cx, cy)</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input className="field" type="number" value={cx} onChange={e => setCx(Number(e.target.value))} />
            <input className="field" type="number" value={cy} onChange={e => setCy(Number(e.target.value))} />
          </div>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{algo === "midpoint" ? "Midpoint" : "Trigonometric"} circle — {pixels.length} pixels</p>
          <PixelGrid pixels={pixels} gridSize={20} cell={16} />
        </div>
        <VivaCheck
          question="Why does the Midpoint circle algorithm only compute points for one octant (45°) and then reflect them?"
          options={[["a", "It's a visual style choice, not a functional necessity"], ["b", "A circle has 8-way symmetry — once you know one octant's pixels, the other 7 are simple mirror reflections, cutting the real work by 8×", ], ["c", "Circles can only be drawn in one octant at a time due to hardware limits"]]}
          correctKey="b"
          explanation="A circle is symmetric across both axes and both diagonals, giving 8 congruent octants. Computing just one octant (using the decision variable to decide each step) and mirroring it into the other 7 is a major efficiency win over recomputing every point independently."
        />
      </>}
    />
  );
}
