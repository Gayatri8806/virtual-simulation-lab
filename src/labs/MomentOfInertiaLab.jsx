import { useState, useMemo } from "react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function MomentOfInertiaLab({ setPage }) {
  const [flangeW, setFlangeW] = useState(12);
  const [flangeT, setFlangeT] = useState(2);
  const [webH, setWebH] = useState(10);
  const [webT, setWebT] = useState(2);

  const { ybar, itotal, a1, a2 } = useMemo(() => {
    const A1 = flangeW * flangeT; // flange (top rectangle)
    const A2 = webH * webT; // web (bottom rectangle)
    const totalH = flangeT + webH;
    const y1 = totalH - flangeT / 2; // centroid of flange from bottom
    const y2 = webH / 2; // centroid of web from bottom
    const A = A1 + A2;
    const ybar = (A1 * y1 + A2 * y2) / A;
    const I1 = (flangeW * flangeT ** 3) / 12 + A1 * (y1 - ybar) ** 2;
    const I2 = (webT * webH ** 3) / 12 + A2 * (y2 - ybar) ** 2;
    return { ybar, itotal: I1 + I2, a1: A1, a2: A2 };
  }, [flangeW, flangeT, webH, webT]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="graphical B4"
      title="Moment of inertia of a composite figure"
      aim="Aim: for a T-shaped composite section (built from two rectangles), find the centroid location and the moment of inertia about the centroidal axis using the parallel axis theorem."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Flange (top)</p>
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Width <span className="mono" style={{ color: AMBER }}>{flangeW} cm</span></label>
          <input type="range" min="6" max="20" value={flangeW} onChange={e => setFlangeW(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Thickness <span className="mono" style={{ color: AMBER }}>{flangeT} cm</span></label>
          <input type="range" min="1" max="4" step="0.5" value={flangeT} onChange={e => setFlangeT(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Web (stem)</p>
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between" }}>Height <span className="mono" style={{ color: AMBER }}>{webH} cm</span></label>
          <input type="range" min="4" max="20" value={webH} onChange={e => setWebH(Number(e.target.value))} style={{ width: "100%" }} />
          <label style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", marginTop: 8 }}>Thickness <span className="mono" style={{ color: AMBER }}>{webT} cm</span></label>
          <input type="range" min="1" max="4" step="0.5" value={webT} onChange={e => setWebT(Number(e.target.value))} style={{ width: "100%" }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>T-section</p>
          <TSectionSVG flangeW={flangeW} flangeT={flangeT} webH={webH} webT={webT} ybar={ybar} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
          <Readout label="Flange area" value={`${a1.toFixed(1)} cm²`} />
          <Readout label="Web area" value={`${a2.toFixed(1)} cm²`} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Centroid ȳ (from bottom)" value={`${ybar.toFixed(2)} cm`} />
          <Readout label="I about centroidal axis" value={`${itotal.toFixed(1)} cm⁴`} />
        </div>
        <VivaCheck
          question="The parallel axis theorem lets you find the moment of inertia of a shape about any axis by:"
          options={[["a", "Adding its own centroidal I to A·d², where d is the distance to the new axis"], ["b", "Multiplying I by the number of pieces"], ["c", "Ignoring the shape's own centroidal inertia entirely"]]}
          correctKey="a"
          explanation="I_axis = I_centroid + A·d² — each piece's own moment of inertia about its own centroid, shifted to the common axis by adding area times the square of the distance between the two axes."
        />
      </>}
    />
  );
}

function TSectionSVG({ flangeW, flangeT, webH, webT, ybar }) {
  const scale = 10;
  const totalH = (flangeT + webH) * scale;
  const w = 280, cx = w / 2;
  const flangeWpx = flangeW * scale, flangeTpx = flangeT * scale;
  const webHpx = webH * scale, webTpx = webT * scale;
  const svgH = totalH + 30;
  const baseY = svgH - 15;
  return (
    <svg viewBox={`0 0 ${w} ${svgH}`} width="100%" height={Math.min(220, svgH)}>
      <rect width={w} height={svgH} fill="#0F1D27" rx="8" />
      <rect x={cx - webTpx / 2} y={baseY - webHpx} width={webTpx} height={webHpx} fill="none" stroke={TEAL_DARK} strokeWidth="2" />
      <rect x={cx - flangeWpx / 2} y={baseY - webHpx - flangeTpx} width={flangeWpx} height={flangeTpx} fill="none" stroke={TEAL_DARK} strokeWidth="2" />
      <line x1={cx - flangeWpx / 2 - 10} y1={baseY - ybar * scale} x2={cx + flangeWpx / 2 + 10} y2={baseY - ybar * scale} stroke={AMBER} strokeWidth="1.5" strokeDasharray="4 3" />
      <text x={cx + flangeWpx / 2 + 14} y={baseY - ybar * scale + 4} fill={AMBER} fontSize="9">ȳ</text>
    </svg>
  );
}
