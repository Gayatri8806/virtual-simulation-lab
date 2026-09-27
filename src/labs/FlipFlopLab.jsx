import { useState } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function FlipFlopLab({ setPage }) {
  const [type, setType] = useState("D");
  const [q, setQ] = useState(0);
  const [inputs, setInputs] = useState({ s: 0, r: 0, j: 0, k: 0, d: 0, t: 0 });
  const [log, setLog] = useState([]);

  const clockPulse = () => {
    let next = q, note = "";
    if (type === "SR") {
      if (inputs.s === 1 && inputs.r === 1) { note = "invalid state (S=R=1)"; }
      else if (inputs.s === 1) { next = 1; note = "SET"; }
      else if (inputs.r === 1) { next = 0; note = "RESET"; }
      else { note = "hold"; }
    } else if (type === "JK") {
      if (inputs.j === 0 && inputs.k === 0) { note = "hold"; }
      else if (inputs.j === 1 && inputs.k === 0) { next = 1; note = "SET"; }
      else if (inputs.j === 0 && inputs.k === 1) { next = 0; note = "RESET"; }
      else { next = 1 - q; note = "TOGGLE"; }
    } else if (type === "D") {
      next = inputs.d; note = `Q follows D (${inputs.d})`;
    } else if (type === "T") {
      if (inputs.t === 1) { next = 1 - q; note = "TOGGLE"; }
      else { note = "hold"; }
    }
    setQ(next);
    setLog(prev => [...prev, { q: next, note }].slice(-6));
  };

  const reset = () => { setQ(0); setLog([]); };

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit II"
      title="SR, JK, D, and T flip-flops"
      aim="Aim: set the inputs of each flip-flop type, apply a clock pulse, and observe how the output state Q changes — building intuition for set, reset, hold, and toggle behavior."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Flip-flop type</label>
          <select className="field" style={{ marginTop: 6 }} value={type} onChange={e => setType(e.target.value)}>
            <option value="SR">SR flip-flop</option>
            <option value="JK">JK flip-flop</option>
            <option value="D">D flip-flop</option>
            <option value="T">T flip-flop</option>
          </select>
          <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
            {type === "SR" && <>
              <ToggleBit label="S" value={inputs.s} onToggle={() => setInputs({ ...inputs, s: 1 - inputs.s })} />
              <ToggleBit label="R" value={inputs.r} onToggle={() => setInputs({ ...inputs, r: 1 - inputs.r })} />
            </>}
            {type === "JK" && <>
              <ToggleBit label="J" value={inputs.j} onToggle={() => setInputs({ ...inputs, j: 1 - inputs.j })} />
              <ToggleBit label="K" value={inputs.k} onToggle={() => setInputs({ ...inputs, k: 1 - inputs.k })} />
            </>}
            {type === "D" && <ToggleBit label="D" value={inputs.d} onToggle={() => setInputs({ ...inputs, d: 1 - inputs.d })} />}
            {type === "T" && <ToggleBit label="T" value={inputs.t} onToggle={() => setInputs({ ...inputs, t: 1 - inputs.t })} />}
          </div>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={clockPulse}>Apply clock pulse ⬆</button>
          <button className="btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={reset}>Reset Q</button>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Output Q</p>
            <p className="mono" style={{ fontSize: 32, color: AMBER, fontWeight: 700, margin: 0 }}>{q}</p>
          </div>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Clock pulse history</p>
          {log.length === 0 ? <p style={{ fontSize: 12.5, color: INK_SOFT }}>Apply a few pulses to see the sequence.</p> : (
            <div className="mono" style={{ fontSize: 12, color: TEAL_DARK, display: "flex", flexDirection: "column", gap: 4 }}>
              {log.map((e, i) => <div key={i}>pulse {i + 1}: Q = {e.q} ({e.note})</div>)}
            </div>
          )}
        </div>
        <VivaCheck
          question="What makes the T (toggle) flip-flop especially useful for building counters?"
          options={[["a", "It never changes state, keeping counters stable"], ["b", "Each clock pulse flips Q to its opposite state when T=1, so chaining T flip-flops naturally produces the alternating bit pattern of a binary count", ], ["c", "T flip-flops require no clock signal at all"]]}
          correctKey="b"
          explanation="A binary counter's bits each toggle at half the rate of the bit before them (bit 0 toggles every pulse, bit 1 every 2 pulses, etc.) — which is exactly the behavior a T flip-flop provides, making it the natural building block for ripple counters."
        />
      </>}
    />
  );
}

function ToggleBit({ label, value, onToggle }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#42566A", margin: "0 0 6px" }}>{label}</p>
      <button onClick={onToggle} className="mono" style={{
        width: 44, height: 44, borderRadius: 8, border: `1.5px solid ${TEAL_DARK}`,
        background: value ? AMBER : "#0F1D27", color: value ? "#0F1D27" : "#5C7686",
        fontSize: 16, fontWeight: 700, cursor: "pointer",
      }}>{value}</button>
    </div>
  );
}
