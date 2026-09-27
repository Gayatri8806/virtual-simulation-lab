import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";

const GATES = {
  AND: { fn: (a, b) => a && b, inputs: 2 },
  OR: { fn: (a, b) => a || b, inputs: 2 },
  NOT: { fn: (a) => !a, inputs: 1 },
  NAND: { fn: (a, b) => !(a && b), inputs: 2 },
  NOR: { fn: (a, b) => !(a || b), inputs: 2 },
  XOR: { fn: (a, b) => a !== b, inputs: 2 },
  XNOR: { fn: (a, b) => a === b, inputs: 2 },
};

function truthRows(gate) {
  const { fn, inputs } = GATES[gate];
  if (inputs === 1) return [[0], [1]].map(([a]) => ({ a, b: null, out: fn(!!a) ? 1 : 0 }));
  return [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => ({ a, b, out: fn(!!a, !!b) ? 1 : 0 }));
}

export default function LogicGateLab({ setPage }) {
  const [gate, setGate] = useState("AND");
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const inputsNeeded = GATES[gate].inputs;
  const out = inputsNeeded === 1 ? (GATES[gate].fn(!!a) ? 1 : 0) : (GATES[gate].fn(!!a, !!b) ? 1 : 0);
  const rows = truthRows(gate);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>Logic gate verification</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: toggle the inputs of each basic gate and confirm the output matches its truth table.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Gate</label>
            <select className="field" value={gate} onChange={e => setGate(e.target.value)}>
              {Object.keys(GATES).map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Input A</label>
            <button className="btn-outline" style={{ width: "100%", marginTop: 8, background: a ? "#E4EFEC" : "transparent" }} onClick={() => setA(a ? 0 : 1)}>{a}</button>

            {inputsNeeded === 2 && (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Input B</label>
                <button className="btn-outline" style={{ width: "100%", marginTop: 8, background: b ? "#E4EFEC" : "transparent" }} onClick={() => setB(b ? 0 : 1)}>{b}</button>
              </>
            )}
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 8px" }}>Output</p>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ margin: "0 auto" }}>
              <circle cx="40" cy="40" r="30" fill={out ? "rgba(217,137,31,0.9)" : "#1A2A36"} stroke={AMBER} strokeWidth="2" />
              <text x="40" y="47" textAnchor="middle" fontSize="20" fontFamily="IBM Plex Mono, monospace" fill={out ? "#2A1A03" : "#7C93A3"}>{out}</text>
            </svg>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Truth table for {gate}</p>
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                <th style={{ padding: "6px 10px" }}>A</th>
                {inputsNeeded === 2 && <th style={{ padding: "6px 10px" }}>B</th>}
                <th style={{ padding: "6px 10px" }}>Output</th>
              </tr></thead>
              <tbody>
                {rows.map((row, idx) => {
                  const isCurrent = row.a === a && (inputsNeeded === 1 || row.b === b);
                  return (
                    <tr key={idx} className="mono" style={{ borderTop: "1px solid #E4DFCE", background: isCurrent ? "#FBF0DE" : "transparent" }}>
                      <td style={{ padding: "7px 10px" }}>{row.a}</td>
                      {inputsNeeded === 2 && <td style={{ padding: "7px 10px" }}>{row.b}</td>}
                      <td style={{ padding: "7px 10px", fontWeight: isCurrent ? 600 : 400 }}>{row.out}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>Which gate outputs 1 only when its inputs differ?</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["a", "AND"], ["b", "XOR"], ["c", "NOR"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - try XOR above with A=0,B=1 and A=1,B=1 to see it." : "Not quite - switch the gate selector to XOR and compare rows 2 and 4 of its table."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
