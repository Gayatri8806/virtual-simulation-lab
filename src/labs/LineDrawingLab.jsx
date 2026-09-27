import { useState, useMemo } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import PixelGrid from "./oopcg/PixelGrid";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

function ddaLine(x0, y0, x1, y1) {
  const dx = x1 - x0, dy = y1 - y0;
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  const xInc = dx / steps, yInc = dy / steps;
  let x = x0, y = y0;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push([Math.round(x), Math.round(y)]);
    x += xInc; y += yInc;
  }
  return pts;
}

function bresenhamLine(x0, y0, x1, y1) {
  const pts = [];
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  let x = x0, y = y0;
  while (true) {
    pts.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 < dx) { err += dx; y += sy; }
  }
  return pts;
}

export default function LineDrawingLab({ setPage }) {
  const [x0, setX0] = useState(2), [y0, setY0] = useState(2);
  const [x1, setX1] = useState(16), [y1, setY1] = useState(9);
  const [algo, setAlgo] = useState("dda");

  const pixels = useMemo(() => algo === "dda" ? ddaLine(x0, y0, x1, y1) : bresenhamLine(x0, y0, x1, y1), [x0, y0, x1, y1, algo]);

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group B &middot; graphics"
      title="Line drawing: DDA and Bresenham's algorithm"
      aim="Aim: plot a line between two points on a pixel grid using the Digital Differential Analyzer (DDA) algorithm and Bresenham's algorithm, and compare how each rounds to integer pixel coordinates."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Algorithm</label>
          <select className="field" style={{ marginTop: 6 }} value={algo} onChange={e => setAlgo(e.target.value)}>
            <option value="dda">DDA</option>
            <option value="bresenham">Bresenham</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Start point (x0, y0)</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input className="field" type="number" value={x0} onChange={e => setX0(Number(e.target.value))} />
            <input className="field" type="number" value={y0} onChange={e => setY0(Number(e.target.value))} />
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>End point (x1, y1)</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input className="field" type="number" value={x1} onChange={e => setX1(Number(e.target.value))} />
            <input className="field" type="number" value={y1} onChange={e => setY1(Number(e.target.value))} />
          </div>
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 10 }}>Grid is 20×20. DDA uses floating-point increments then rounds; Bresenham uses only integer arithmetic.</p>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{algo === "dda" ? "DDA" : "Bresenham"} result — {pixels.length} pixels plotted</p>
          <PixelGrid pixels={pixels} gridSize={20} cell={16} />
        </div>
        <VivaCheck
          question="Why is Bresenham's algorithm generally preferred over DDA in real graphics hardware?"
          options={[["a", "Bresenham draws curved lines, DDA can't"], ["b", "Bresenham uses only integer addition/subtraction, avoiding the rounding and floating-point overhead that DDA needs at every step", ], ["c", "There's no real difference between them"]]}
          correctKey="b"
          explanation="DDA computes a floating-point increment each step and rounds to the nearest pixel. Bresenham reformulates the same problem using only integer arithmetic (via a decision variable), which is faster and avoids cumulative rounding error — ideal for hardware implementation."
        />
      </>}
    />
  );
}
