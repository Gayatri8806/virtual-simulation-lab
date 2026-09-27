import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { INK_SOFT } from "../constants";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

const EXAMPLES = ["42", "3.14", "'hello'", "True", "[1, 2, 3]", "(1, 2)", "{'a': 1}", "None"];

function inferType(literal) {
  const t = literal.trim();
  if (/^-?\d+$/.test(t)) return "int";
  if (/^-?\d+\.\d+$/.test(t)) return "float";
  if (/^(['"]).*\1$/.test(t)) return "str";
  if (t === "True" || t === "False") return "bool";
  if (t === "None") return "NoneType";
  if (/^\[.*\]$/.test(t)) return "list";
  if (/^\(.*\)$/.test(t)) return "tuple";
  if (/^\{.*:.*\}$/.test(t)) return "dict";
  if (/^\{.*\}$/.test(t)) return "set";
  return null;
}

export default function VariablesLab({ setPage }) {
  const [literal, setLiteral] = useState("42");
  const [log, setLog] = useState([]);

  const run = () => {
    const t = inferType(literal);
    setLog(prev => [...prev, { code: `x = ${literal}\nprint(type(x))`, out: t ? `<class '${t}'>` : "SyntaxError: could not parse this literal", isError: !t }]);
  };
  const reset = () => setLog([]);

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit I"
      title="Display data of different types using variables and literals"
      aim="Aim: assign different kinds of Python literals to a variable and use type() to see what type Python infers for each one."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Literal to assign</label>
          <input className="field" value={literal} onChange={e => setLiteral(e.target.value)} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Try: {EXAMPLES.map((ex, i) => (
            <span key={ex}>
              <span style={{ color: "#2E6F63", cursor: "pointer", textDecoration: "underline" }} onClick={() => setLiteral(ex)}>{ex}</span>{i < EXAMPLES.length - 1 ? ", " : ""}
            </span>
          ))}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={run}>Run</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "x = 42\nprint(type(x))", out: "<class 'int'>" }]} />
        <VivaCheck
          question="What does Python's type() function return?"
          options={[["a", "The value itself"], ["b", "The class/type of the object"], ["c", "The memory address"]]}
          correctKey="b"
          explanation="type(x) returns the class of the object referenced by x — int, float, str, list, and so on — which Python infers automatically from the literal you assigned."
        />
      </>}
    />
  );
}
