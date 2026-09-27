import { useState } from "react";
import OOPCGLabShell from "./oopcg/OOPCGLabShell";
import JavaConsole from "./oopcg/JavaConsole";
import VivaCheck from "./oopcg/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function CalculatorLab({ setPage }) {
  const [a, setA] = useState(12);
  const [b, setB] = useState(4);
  const [op, setOp] = useState("+");
  const [history, setHistory] = useState([]);
  const [log, setLog] = useState([]);

  const compute = () => {
    let result, valid = true;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      case "/": if (b === 0) { valid = false; } else { result = a / b; } break;
      default: valid = false;
    }
    if (!valid) {
      setLog(prev => [...prev, { out: `ArithmeticException: / by zero`, isError: true }]);
      return;
    }
    setHistory(prev => [...prev, `${a} ${op} ${b} = ${result}`]);
    setLog(prev => [...prev, { out: `Result: ${result}` }]);
  };

  const showLoopSum = () => {
    let sum = 0;
    const steps = [];
    for (let i = 1; i <= 5; i++) {
      sum += i;
      steps.push(`sum after adding ${i}: ${sum}`);
    }
    setLog(prev => [...prev, { out: `for(int i=1;i<=5;i++) sum+=i;\n${steps.join("\n")}\nFinal sum = ${sum}` }]);
  };

  return (
    <OOPCGLabShell
      setPage={setPage}
      group="Group A &middot; OOP"
      title="Calculator with dynamic input, conditionals and looping"
      aim="Aim: build a calculator that reads two numbers and an operator, uses conditional logic (switch-case) to compute the result, and demonstrates a simple accumulator loop — while keeping a running history."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>First number</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={a} onChange={e => setA(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Operator</label>
          <select className="field" style={{ marginTop: 6 }} value={op} onChange={e => setOp(e.target.value)}>
            <option value="+">+</option><option value="-">-</option><option value="*">*</option><option value="/">/</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Second number</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={b} onChange={e => setB(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 14 }} onClick={compute}>Compute (switch-case)</button>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={showLoopSum}>Demo: loop sum 1 to 5</button>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>History</p>
          {history.length === 0 ? <p style={{ fontSize: 12.5, color: INK_SOFT }}>No calculations yet.</p> : (
            <div className="mono" style={{ fontSize: 12, color: AMBER, display: "flex", flexDirection: "column", gap: 4 }}>
              {history.map((h, i) => <div key={i}>{h}</div>)}
            </div>
          )}
        </div>
      </>}
      results={<>
        <JavaConsole log={log.length ? log : [{ out: "// results appear here" }]} />
        <VivaCheck
          question="Why use a switch-case here instead of a chain of if-else statements?"
          options={[["a", "switch-case is always faster in every language and case"], ["b", "It's often clearer to read when checking one variable against several fixed values, like an operator symbol"], ["c", "if-else can't handle strings or chars at all"]]}
          correctKey="b"
          explanation="switch-case shines readability-wise when comparing a single variable against a set of discrete constant values (like '+', '-', '*', '/') — it reads as a clean menu of cases rather than a nested chain of conditions."
        />
      </>}
    />
  );
}
