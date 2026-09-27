import { useState } from "react";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V_PHASE = 230;
const I_PHASE = 5;

export default function ThreePhaseLab({ setPage }) {
  const [connection, setConnection] = useState("star");

  const isStar = connection === "star";
  const vLine = isStar ? V_PHASE * Math.sqrt(3) : V_PHASE;
  const iLine = isStar ? I_PHASE : I_PHASE * Math.sqrt(3);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 8"
      title="Phase and line quantities: star vs delta connection"
      aim="Aim: for a balanced three-phase load, compare how line voltage and line current relate to phase voltage and phase current under star and delta connections."
      procedure={[
        "Connect the three-phase load in star: each phase winding between one line and the common neutral point.",
        "Measure the phase voltage (across one winding) and the line voltage (between two lines) — note the √3 relationship.",
        "Reconnect the same load in delta: each phase winding directly between two lines.",
        "Measure phase current (through one winding) and line current (into one terminal) — note the √3 relationship, now on the current side instead.",
      ]}
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Connection type</label>
          <select className="field" style={{ marginTop: 6 }} value={connection} onChange={e => setConnection(e.target.value)}>
            <option value="star">Star (Y)</option>
            <option value="delta">Delta (Δ)</option>
          </select>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Readout label="Phase voltage (fixed)" value={`${V_PHASE} V`} />
          <Readout label="Phase current (fixed)" value={`${I_PHASE} A`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{isStar ? "Star (Y)" : "Delta (Δ)"} connection</p>
          <ConnectionSVG isStar={isStar} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Line voltage" value={`${vLine.toFixed(1)} V`} />
          <Readout label="Line current" value={`${iLine.toFixed(2)} A`} />
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>
          {isStar ? "Star: VLine = √3 × VPhase, ILine = IPhase" : "Delta: VLine = VPhase, ILine = √3 × IPhase"}
        </p>
        <VivaCheck
          question="In a delta-connected balanced three-phase load, the line current is:"
          options={[["a", "Equal to the phase current"], ["b", "√3 times the phase current"], ["c", "Three times the phase current"]]}
          correctKey="b"
          explanation="In delta, each line connects to two phase windings simultaneously, so the line current is the phasor sum of two phase currents 120° apart — which works out to √3 times a single phase current, not a simple doubling."
        />
      </>}
    />
  );
}

function ConnectionSVG({ isStar }) {
  const cx = 140, cy = 100;
  const pts = [0, 120, 240].map(deg => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + 80 * Math.sin(rad), y: cy - 80 * Math.cos(rad) };
  });
  return (
    <svg viewBox="0 0 280 200" width="100%" height="180">
      <rect width="280" height="200" fill="#0F1D27" rx="8" />
      {isStar ? (
        <>
          {pts.map((p, i) => <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke={TEAL_DARK} strokeWidth="2" />)}
          <circle cx={cx} cy={cy} r="4" fill={AMBER} />
        </>
      ) : (
        pts.map((p, i) => {
          const next = pts[(i + 1) % 3];
          return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke={TEAL_DARK} strokeWidth="2" />;
        })
      )}
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill={AMBER} />)}
      {["R", "Y", "B"].map((label, i) => <text key={label} x={pts[i].x + (pts[i].x > cx ? 8 : -14)} y={pts[i].y} fill="#7C93A3" fontSize="11">{label}</text>)}
    </svg>
  );
}
