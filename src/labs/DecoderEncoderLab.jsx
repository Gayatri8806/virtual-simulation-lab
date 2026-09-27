import { useState } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function DecoderEncoderLab({ setPage }) {
  const [decIn, setDecIn] = useState(2);
  const [encIn, setEncIn] = useState([0, 0, 1, 0, 0, 0, 0, 0]);

  const toggleEnc = (i) => setEncIn(prev => {
    const next = [0, 0, 0, 0, 0, 0, 0, 0];
    next[i] = 1; // priority encoder: only one active input for simplicity
    return next;
  });

  const activeInput = encIn.indexOf(1);
  const encOutput = activeInput >= 0 ? activeInput.toString(2).padStart(3, "0") : "---";

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit III"
      title="2-to-4 decoder and 8-to-3 priority encoder"
      aim="Aim: use a 2-bit input to activate exactly one of four decoder output lines, and use an 8-line input to encode which single active line is present as a 3-bit binary code."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Decoder: 2-bit input</p>
          <select className="field" value={decIn} onChange={e => setDecIn(Number(e.target.value))}>
            <option value={0}>00</option><option value={1}>01</option><option value={2}>10</option><option value={3}>11</option>
          </select>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Encoder: click one active input line</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {encIn.map((v, i) => (
              <button key={i} onClick={() => toggleEnc(i)} className="mono" style={{ width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: v ? AMBER : "#0F1D27", color: v ? "#0F1D27" : "#5C7686", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>D{i}</button>
            ))}
          </div>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>Decoder outputs (only one line active)</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: INK_SOFT, margin: "0 0 4px" }}>Y{i}</p>
                <div className="mono" style={{ width: 36, height: 36, lineHeight: "36px", borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: i === decIn ? AMBER : "#0F1D27", color: i === decIn ? "#0F1D27" : "#5C7686", fontWeight: 700, margin: "0 auto" }}>{i === decIn ? 1 : 0}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Encoder output (3-bit binary)</p>
            <p className="mono" style={{ fontSize: 22, color: AMBER, fontWeight: 700, margin: 0 }}>{encOutput}</p>
          </div>
        </div>
        <VivaCheck
          question="Why is a real encoder usually built as a 'priority' encoder rather than a plain encoder?"
          options={[["a", "Priority encoders are cheaper to manufacture"], ["b", "A plain encoder gives undefined/incorrect output if more than one input is active at once; a priority encoder resolves this by always encoding the highest-priority active input", ], ["c", "Priority encoders don't need any inputs at all"]]}
          correctKey="b"
          explanation="A basic encoder assumes exactly one input is active — if two inputs go high simultaneously, its output becomes ambiguous (often the OR of both codes, which is meaningless). A priority encoder handles this realistically by always picking the highest-priority line among any that are active."
        />
      </>}
    />
  );
}
