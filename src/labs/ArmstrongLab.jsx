import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function ArmstrongLab({ setPage }) {
  const [num, setNum] = useState(153);
  const [log, setLog] = useState([]);

  const run = () => {
    const s = String(Math.abs(Number(num)));
    const n = s.length;
    const sum = s.split("").reduce((acc, d) => acc + Math.pow(Number(d), n), 0);
    const isArmstrong = sum === Math.abs(Number(num));
    setLog(prev => [...prev, {
      code: `num = ${num}\ndigits = str(num)\nn = len(digits)\ntotal = sum(int(d) ** n for d in digits)\nprint(total == num)`,
      out: `${sum} == ${num} -> ${isArmstrong}${isArmstrong ? "  # Armstrong number!" : ""}`,
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit II"
      title="Armstrong number checker"
      aim="Aim: check whether a number equals the sum of its own digits, each raised to the power of the digit count (e.g. 153 = 1³ + 5³ + 3³)."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Number</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={num} onChange={e => setNum(e.target.value)} />
          <p style={{ fontSize: 12, color: "#42566A", marginTop: 8 }}>Try 153, 370, 9474, or 123 (not Armstrong).</p>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={run}>Run</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "num = 153\n# 1**3 + 5**3 + 3**3 = 153\nprint(153 == 153)", out: "True" }]} />
        <VivaCheck
          question="153 is an Armstrong number because:"
          options={[["a", "It's divisible by 3"], ["b", "1³ + 5³ + 3³ = 153, matching the original number"], ["c", "It has exactly 3 digits"]]}
          correctKey="b"
          explanation="An Armstrong number equals the sum of its digits each raised to the power of the total digit count — for 153 (3 digits): 1³+5³+3³ = 1+125+27 = 153."
        />
      </>}
    />
  );
}
