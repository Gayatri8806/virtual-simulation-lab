import { useState } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function MuxDemuxLab({ setPage }) {
  const [inputs, setInputs] = useState([0, 1, 1, 0]);
  const [select, setSelect] = useState(0);
  const [demuxData, setDemuxData] = useState(1);

  const toggleInput = (i) => setInputs(prev => prev.map((v, idx) => idx === i ? 1 - v : v));
  const muxOutput = inputs[select];

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit III"
      title="4-to-1 multiplexer and 1-to-4 demultiplexer"
      aim="Aim: use select lines to route one of four data inputs to a single output (multiplexer), and route a single input to one of four outputs (demultiplexer)."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Multiplexer: 4 data inputs</p>
          <div style={{ display: "flex", gap: 10 }}>
            {inputs.map((v, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: INK_SOFT, margin: "0 0 4px" }}>I{i}</p>
                <button onClick={() => toggleInput(i)} className="mono" style={{ width: 36, height: 36, borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: v ? AMBER : "#0F1D27", color: v ? "#0F1D27" : "#5C7686", fontWeight: 700, cursor: "pointer" }}>{v}</button>
              </div>
            ))}
          </div>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Select line (S1 S0)</label>
          <select className="field" style={{ marginTop: 6 }} value={select} onChange={e => setSelect(Number(e.target.value))}>
            <option value={0}>00 → select I0</option>
            <option value={1}>01 → select I1</option>
            <option value={2}>10 → select I2</option>
            <option value={3}>11 → select I3</option>
          </select>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Demultiplexer: single data input</p>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => setDemuxData(1 - demuxData)} className="mono" style={{ width: 40, height: 40, borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: demuxData ? AMBER : "#0F1D27", color: demuxData ? "#0F1D27" : "#5C7686", fontWeight: 700, cursor: "pointer" }}>{demuxData}</button>
          </div>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>MUX output Y = I{select}</p>
            <p className="mono" style={{ fontSize: 24, color: AMBER, fontWeight: 700, margin: 0 }}>{muxOutput}</p>
          </div>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 10 }}>DEMUX outputs (using the same select line)</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, color: INK_SOFT, margin: "0 0 4px" }}>Y{i}</p>
                <div className="mono" style={{ width: 36, height: 36, lineHeight: "36px", borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: i === select ? AMBER : "#0F1D27", color: i === select ? "#0F1D27" : "#5C7686", fontWeight: 700, margin: "0 auto" }}>{i === select ? demuxData : 0}</div>
              </div>
            ))}
          </div>
        </div>
        <VivaCheck
          question="A multiplexer and demultiplexer perform roughly opposite jobs. Which statement describes this correctly?"
          options={[["a", "MUX combines many inputs into one output based on a select line; DEMUX routes one input to one of many outputs based on a select line", ], ["b", "Both circuits do exactly the same thing"], ["c", "MUX only works with analog signals, DEMUX only with digital"]]}
          correctKey="a"
          explanation="A MUX is a data selector — many-to-one, picking which input reaches the output. A DEMUX is a data distributor — one-to-many, routing a single input to a chosen output line. Both use the same select-line logic, just in opposite directions."
        />
      </>}
    />
  );
}
