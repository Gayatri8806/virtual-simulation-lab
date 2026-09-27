import { useState, useMemo } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const XMIN = 60, YMIN = 40, XMAX = 220, YMAX = 160;
const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;

function computeCode(x, y) {
  let code = INSIDE;
  if (x < XMIN) code |= LEFT; else if (x > XMAX) code |= RIGHT;
  if (y < YMIN) code |= BOTTOM; else if (y > YMAX) code |= TOP;
  return code;
}

function cohenSutherland(x0, y0, x1, y1) {
  let code0 = computeCode(x0, y0), code1 = computeCode(x1, y1);
  let accept = false;
  let steps = [];
  let iterations = 0;
  while (iterations++ < 10) {
    if ((code0 | code1) === 0) { accept = true; break; }
    if ((code0 & code1) !== 0) { break; }
    const codeOut = code0 !== 0 ? code0 : code1;
    let x, y;
    if (codeOut & TOP) { x = x0 + (x1 - x0) * (YMAX - y0) / (y1 - y0); y = YMAX; }
    else if (codeOut & BOTTOM) { x = x0 + (x1 - x0) * (YMIN - y0) / (y1 - y0); y = YMIN; }
    else if (codeOut & RIGHT) { y = y0 + (y1 - y0) * (XMAX - x0) / (x1 - x0); x = XMAX; }
    else { y = y0 + (y1 - y0) * (XMIN - x0) / (x1 - x0); x = XMIN; }
    steps.push(`clipped point: (${x.toFixed(1)}, ${y.toFixed(1)})`);
    if (codeOut === code0) { x0 = x; y0 = y; code0 = computeCode(x0, y0); }
    else { x1 = x; y1 = y; code1 = computeCode(x1, y1); }
  }
  return { accept, clipped: accept ? [x0, y0, x1, y1] : null, steps };
}

export default function LineClippingLab({ setPage }) {
  const [x0, setX0] = useState(20), [y0, setY0] = useState(20);
  const [x1, setX1] = useState(260), [y1, setY1] = useState(180);

  const { accept, clipped, steps } = useMemo(() => cohenSutherland(x0, y0, x1, y1), [x0, y0, x1, y1]);

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group B &middot; graphics"
      title="Cohen-Sutherland line clipping"
      aim="Aim: given a rectangular clipping window, use the Cohen-Sutherland region-code algorithm to clip a line so only the portion inside the window remains visible."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Line start (x0, y0)</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input className="field" type="number" value={x0} onChange={e => setX0(Number(e.target.value))} />
            <input className="field" type="number" value={y0} onChange={e => setY0(Number(e.target.value))} />
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Line end (x1, y1)</label>
          <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
            <input className="field" type="number" value={x1} onChange={e => setX1(Number(e.target.value))} />
            <input className="field" type="number" value={y1} onChange={e => setY1(Number(e.target.value))} />
          </div>
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 10 }}>Clipping window: x ∈ [{XMIN}, {XMAX}], y ∈ [{YMIN}, {YMAX}]</p>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Clipping result</p>
          <svg viewBox="0 0 280 220" width="100%" height="220" style={{ background: "#0F1D27", borderRadius: 8 }}>
            <rect x={XMIN} y={220 - YMAX} width={XMAX - XMIN} height={YMAX - YMIN} fill="none" stroke="#5C7686" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1={x0} y1={220 - y0} x2={x1} y2={220 - y1} stroke="#7C93A3" strokeWidth="1.5" strokeDasharray="3 3" />
            {accept && <line x1={clipped[0]} y1={220 - clipped[1]} x2={clipped[2]} y2={220 - clipped[3]} stroke={AMBER} strokeWidth="3" />}
          </svg>
          <p style={{ fontSize: 12.5, color: accept ? TEAL_DARK : "#B23A2E", marginTop: 8 }}>{accept ? "Line clipped to the window (bright segment)." : "Line lies entirely outside the window — fully rejected."}</p>
        </div>
        {steps.length > 0 && (
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Clipping steps</p>
            <div className="mono" style={{ fontSize: 12, color: INK_SOFT }}>{steps.map((s, i) => <div key={i}>{s}</div>)}</div>
          </div>
        )}
        <VivaCheck
          question="In Cohen-Sutherland clipping, if the bitwise AND of both endpoints' region codes is non-zero, the line is:"
          options={[["a", "Fully inside the window, accept immediately"], ["b", "Fully outside the window on the same side — trivially rejected without further computation", ], ["c", "Guaranteed to need three or more clip operations"]]}
          correctKey="b"
          explanation="Each bit in a region code marks being outside one specific edge (left/right/top/bottom). If both endpoints share a set bit, they're both outside on that same side — meaning the whole line can't possibly cross into the window, so it's trivially rejected."
        />
      </>}
    />
  );
}
