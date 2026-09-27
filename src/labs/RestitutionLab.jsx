import { useState, useRef, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import MechLabShell from "./mech/MechLabShell";
import VivaCheck from "./mech/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const E_TRUE = 0.62; // hidden true coefficient of restitution

export default function RestitutionLab({ setPage }) {
  const [dropHeight, setDropHeight] = useState(1.0);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const bounceHeight = (E_TRUE ** 2) * dropHeight;

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, h1: dropHeight.toFixed(2), h2: bounceHeight.toFixed(3), e: Math.sqrt(bounceHeight / dropHeight).toFixed(3) }]);
  const reset = () => setReadings([]);

  const avgE = useMemo(() => {
    if (readings.length === 0) return null;
    return readings.reduce((a, r) => a + Number(r.e), 0) / readings.length;
  }, [readings]);

  return (
    <MechLabShell
      setPage={setPage}
      unit="compulsory A4"
      title="Determination of coefficient of restitution"
      aim="Aim: drop a ball from a known height, measure the height it bounces back to, and use e = √(h2/h1) to find the coefficient of restitution."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Drop height h1 <span className="mono" style={{ color: AMBER }}>{dropHeight.toFixed(2)} m</span>
          </label>
          <input type="range" min="0.3" max="2" step="0.05" value={dropHeight} onChange={e => setDropHeight(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Drop & record</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Bounce height h2" value={`${bounceHeight.toFixed(3)} m`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
          {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>Drop the ball from a few different heights and record each bounce.</p> : (
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: INK_SOFT }}><th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>h1 (m)</th><th style={{ padding: "4px 6px" }}>h2 (m)</th><th style={{ padding: "4px 6px" }}>e = √(h2/h1)</th></tr></thead>
              <tbody>{readings.map((r, i) => (
                <tr key={r.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}><td style={{ padding: "5px 6px" }}>{i + 1}</td><td style={{ padding: "5px 6px" }}>{r.h1}</td><td style={{ padding: "5px 6px" }}>{r.h2}</td><td style={{ padding: "5px 6px" }}>{r.e}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Average e" value={avgE !== null ? avgE.toFixed(3) : "—"} />
        </div>
        <VivaCheck
          question="A coefficient of restitution of e = 1 would mean:"
          options={[["a", "A perfectly inelastic collision (ball doesn't bounce at all)"], ["b", "A perfectly elastic collision (ball bounces back to the exact same height)"], ["c", "The ball breaks on impact"]]}
          correctKey="b"
          explanation="e = 1 means no kinetic energy is lost in the collision — the ball would rebound to exactly its original drop height. Real balls always have e < 1 due to energy lost as heat and sound."
        />
      </>}
    />
  );
}
