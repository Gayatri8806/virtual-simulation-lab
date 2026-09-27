import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function EncapsulationLab({ setPage }) {
  const [log, setLog] = useState([]);

  const runPublic = () => {
    setLog(prev => [...prev, {
      code: `class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.balance = balance\n\nacc = Account("Riya", 5000)\nprint(acc.balance)`,
      out: "5000",
    }]);
  };
  const runPrivate = () => {
    setLog(prev => [...prev, {
      code: `class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.__balance = balance\n\nacc = Account("Riya", 5000)\nprint(acc.__balance)`,
      out: "AttributeError: 'Account' object has no attribute '__balance'",
      isError: true,
    }]);
  };
  const runGetter = () => {
    setLog(prev => [...prev, {
      code: `class Account:\n    def __init__(self, owner, balance):\n        self.owner = owner\n        self.__balance = balance\n\n    def get_balance(self):\n        return self.__balance\n\nacc = Account("Riya", 5000)\nprint(acc.get_balance())`,
      out: "5000",
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit V"
      title="Public vs private class members"
      aim="Aim: compare a public attribute (accessible directly) with a private attribute (name-mangled with a double underscore), and see how a getter method provides safe access."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Try each</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-primary" onClick={runPublic}>Access public: acc.balance</button>
            <button className="btn-primary" onClick={runPrivate}>Access private: acc.__balance</button>
            <button className="btn-primary" onClick={runGetter}>Access via getter method</button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# try each access pattern on the left", out: null }]} />
        <VivaCheck
          question="Prefixing an attribute with __ (double underscore) in Python:"
          options={[["a", "Makes it truly impossible to access from outside"], ["b", "Triggers name mangling, discouraging direct outside access"], ["c", "Has no effect at all"]]}
          correctKey="b"
          explanation="Python doesn't have real private members — __balance is renamed internally to _Account__balance (name mangling), which discourages but doesn't fully prevent outside access; the convention signals 'don't touch this directly, use a method.'"
        />
      </>}
    />
  );
}
