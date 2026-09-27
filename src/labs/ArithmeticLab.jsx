import { useState } from "react";
import { RotateCcw } from "lucide-react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

const OPS = [
  { sym: "+", fn: (a, b) => a + b },
  { sym: "-", fn: (a, b) => a - b },
  { sym: "*", fn: (a, b) => a * b },
  { sym: "/", fn: (a, b) => (b === 0 ? null : a / b) },
  { sym: "//", fn: (a, b) => (b === 0 ? null : Math.floor(a / b)) },
  { sym: "%", fn: (a, b) => (b === 0 ? null : a % b) },
  { sym: "**", fn: (a, b) => a ** b },
];

export default function ArithmeticLab({ setPage }) {
  const [a, setA] = useState(17);
  const [b, setB] = useState(5);
  const [sym, setSym] = useState("//");
  const [log, setLog] = useState([]);

  const run = () => {
    const op = OPS.find(o => o.sym === sym);
    const result = op.fn(Number(a), Number(b));
    setLog(prev => [...prev, {
      code: `a = ${a}\nb = ${b}\nprint(a ${sym} b)`,
      out: result === null ? "ZeroDivisionError: division by zero" : String(result),
      isError: result === null,
    }]);
  };
  const reset = () => setLog([]);

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit I"
      title="Arithmetic operators and expressions"
      aim="Aim: evaluate Python's arithmetic operators — addition, subtraction, multiplication, true division, floor division, modulus, and exponent — on two numbers."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>a</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={a} onChange={e => setA(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>b</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={b} onChange={e => setB(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Operator</label>
          <select className="field" style={{ marginTop: 6 }} value={sym} onChange={e => setSym(e.target.value)}>
            {OPS.map(o => <option key={o.sym} value={o.sym}>{o.sym}</option>)}
          </select>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={run}>Run</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "a = 17\nb = 5\nprint(a // b)", out: "3" }]} />
        <VivaCheck
          question="What is the difference between / and // in Python?"
          options={[["a", "No difference"], ["b", "/ gives a float result, // gives the floored integer quotient"], ["c", "// is for strings only"]]}
          correctKey="b"
          explanation="/ always returns a float (true division), while // returns the floor of the division — e.g. 17 // 5 gives 3, but 17 / 5 gives 3.4."
        />
      </>}
    />
  );
}
