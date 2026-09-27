import { useState } from "react";
import { RotateCcw } from "lucide-react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function CounterLab({ setPage }) {
  const [mode, setMode] = useState("ripple");
  const [modN, setModN] = useState(6);
  const [count, setCount] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pulses, setPulses] = useState(0);

  const clockPulse = () => {
    setPulses(p => p + 1);
    if (mode === "mod-n") {
      setCount(c => (c + direction + modN) % modN);
    } else {
      setCount(c => (c + direction + 16) % 16);
    }
  };

  const reset = () => { setCount(0); setPulses(0); };

  const maxBits = mode === "mod-n" ? Math.ceil(Math.log2(modN)) : 4;
  const bits = count.toString(2).padStart(maxBits, "0").split("").map(Number);

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit II"
      title="Ripple, synchronous, and mod-N counters"
      aim="Aim: apply clock pulses to a binary counter and watch it increment (or decrement), including a mod-N counter that resets back to zero after N counts instead of the full binary range."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Counter type</label>
          <select className="field" style={{ marginTop: 6 }} value={mode} onChange={e => { setMode(e.target.value); reset(); }}>
            <option value="ripple">4-bit ripple (asynchronous) counter</option>
            <option value="synchronous">4-bit synchronous counter</option>
            <option value="mod-n">Mod-N counter</option>
          </select>
          {mode === "mod-n" && (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                N <span className="mono" style={{ color: AMBER }}>{modN}</span>
              </label>
              <input type="range" min="2" max="15" value={modN} onChange={e => { setModN(Number(e.target.value)); reset(); }} style={{ width: "100%", marginTop: 8 }} />
            </>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn-outline" style={{ flex: 1, background: direction === 1 ? "#0F1D27" : undefined }} onClick={() => setDirection(1)}>Up</button>
            <button className="btn-outline" style={{ flex: 1, background: direction === -1 ? "#0F1D27" : undefined }} onClick={() => setDirection(-1)}>Down</button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={clockPulse}>Clock pulse ⬆</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={14} /></button>
          </div>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <p style={{ fontSize: 12, color: INK_SOFT, margin: 0 }}>Count value</p>
          <p className="mono" style={{ fontSize: 32, color: AMBER, fontWeight: 700, margin: 0 }}>{count}</p>
          <div style={{ display: "flex", gap: 6 }}>
            {bits.map((b, i) => <div key={i} className="mono" style={{ width: 30, height: 30, lineHeight: "30px", textAlign: "center", borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: "#0F1D27", color: TEAL_DARK, fontSize: 13, fontWeight: 700 }}>{b}</div>)}
          </div>
        </div>
        <div className="card">
          <p style={{ fontSize: 12.5, color: INK_SOFT, margin: 0 }}>Clock pulses applied: <span className="mono" style={{ color: TEAL_DARK }}>{pulses}</span></p>
          {mode === "mod-n" && <p style={{ fontSize: 12.5, color: INK_SOFT, margin: "6px 0 0" }}>Counts 0 through {modN - 1}, then wraps back to 0 (or {modN - 1} counting down).</p>}
        </div>
        <VivaCheck
          question="What's the practical difference between a ripple (asynchronous) counter and a synchronous counter?"
          options={[["a", "There is no real difference — both count identically in every way"], ["b", "In a ripple counter, each flip-flop is clocked by the output of the previous one, so changes propagate with a small cumulative delay; a synchronous counter clocks every flip-flop simultaneously from the same clock signal, avoiding that delay", ], ["c", "Synchronous counters can't count past 15"]]}
          correctKey="b"
          explanation="Ripple counters chain flip-flops so each one's clock comes from the previous stage's output — simple to build, but the propagation delay accumulates stage by stage. Synchronous counters drive every flip-flop from the same common clock, so all bits update together with no ripple delay, at the cost of more complex control logic."
        />
      </>}
    />
  );
}
