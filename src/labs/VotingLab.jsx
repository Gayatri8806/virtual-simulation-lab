import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function VotingLab({ setPage }) {
  const [age, setAge] = useState(18);
  const [log, setLog] = useState([]);

  const run = () => {
    const eligible = Number(age) >= 18;
    setLog(prev => [...prev, {
      code: `age = ${age}\nif age >= 18:\n    print("Eligible to vote")\nelse:\n    print("Not eligible to vote")`,
      out: eligible ? "Eligible to vote" : "Not eligible to vote",
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit II"
      title="Voting eligibility checker"
      aim="Aim: use an if-else statement to check whether a person is eligible to vote (age 18 or above)."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Age</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={age} onChange={e => setAge(e.target.value)} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={run}>Run</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "age = 18\nif age >= 18:\n    print(\"Eligible to vote\")\nelse:\n    print(\"Not eligible to vote\")", out: "Eligible to vote" }]} />
        <VivaCheck
          question="What does the else block execute?"
          options={[["a", "Always, regardless of the if condition"], ["b", "Only when the if condition is False"], ["c", "Only when age is exactly 18"]]}
          correctKey="b"
          explanation="The else block runs only when the preceding if condition evaluates to False — here, when age is less than 18."
        />
      </>}
    />
  );
}
