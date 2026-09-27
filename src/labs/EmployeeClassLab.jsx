import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function EmployeeClassLab({ setPage }) {
  const [name, setName] = useState("Aditi Rao");
  const [basic, setBasic] = useState(40000);
  const [bonusPct, setBonusPct] = useState(10);
  const [log, setLog] = useState([]);

  const netSalary = basic + (basic * bonusPct) / 100;

  const run = () => {
    setLog(prev => [...prev, {
      code: `class Employee:\n    def __init__(self, name, basic, bonus_pct):\n        self.name = name\n        self.basic = basic\n        self.bonus_pct = bonus_pct\n\n    def net_salary(self):\n        return self.basic + self.basic * self.bonus_pct / 100\n\nemp = Employee("${name}", ${basic}, ${bonusPct})\nprint(emp.name, "->", emp.net_salary())`,
      out: `${name} -> ${netSalary.toFixed(2)}`,
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit V"
      title="Employee class with a computed member function"
      aim="Aim: define an Employee class that stores basic pay and bonus percentage as attributes, and computes net salary via a member function net_salary()."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Employee name</label>
          <input className="field" style={{ marginTop: 6 }} value={name} onChange={e => setName(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Basic pay (₹)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={basic} onChange={e => setBasic(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Bonus %</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={bonusPct} onChange={e => setBonusPct(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={run}>Run</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: 'emp = Employee("Aditi Rao", 40000, 10)\nprint(emp.net_salary())', out: "44000.0" }]} />
        <VivaCheck
          question="Why compute net_salary() as a method instead of storing it as a plain attribute?"
          options={[["a", "Methods run faster than attributes"], ["b", "It's recalculated fresh from basic and bonus_pct each time, so it can never go stale"], ["c", "Python doesn't allow storing computed values"]]}
          correctKey="b"
          explanation="A method recomputes its result on every call from the current attribute values — so if basic or bonus_pct changes, net_salary() always reflects the latest data, unlike a stored value that could drift out of sync."
        />
      </>}
    />
  );
}
