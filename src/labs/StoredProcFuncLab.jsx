import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function StoredProcFuncLab({ setPage }) {
  const [balance, setBalance] = useState(20000);
  const [bonusPct, setBonusPct] = useState(10);
  const [log, setLog] = useState([]);

  const callProcedure = () => {
    const newBalance = balance + (balance * bonusPct) / 100;
    setLog(prev => [...prev, {
      code: `CREATE OR REPLACE PROCEDURE apply_bonus(p_pct IN NUMBER) IS\nBEGIN\n  UPDATE EMPLOYEE SET salary = salary + salary * p_pct / 100;\n  COMMIT;\nEND;\n\nEXEC apply_bonus(${bonusPct});`,
      text: `Procedure executed.\nSalary: ${balance.toFixed(2)} -> ${newBalance.toFixed(2)}`,
    }]);
    setBalance(newBalance);
  };

  const callFunction = () => {
    const tax = balance > 50000 ? balance * 0.2 : balance * 0.1;
    setLog(prev => [...prev, {
      code: `CREATE OR REPLACE FUNCTION calc_tax(p_salary IN NUMBER) RETURN NUMBER IS\nBEGIN\n  IF p_salary > 50000 THEN\n    RETURN p_salary * 0.20;\n  ELSE\n    RETURN p_salary * 0.10;\n  END IF;\nEND;\n\nSELECT calc_tax(${balance.toFixed(0)}) FROM DUAL;`,
      text: `Returned value: ${tax.toFixed(2)}`,
    }]);
  };

  const reset = () => { setBalance(20000); setLog([]); };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 5"
      title="PL/SQL: stored procedures and functions"
      aim="Aim: write a stored procedure that updates data as a side effect (apply a salary bonus), and a function that computes and returns a value (calculate tax) without modifying anything."
      controls={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>Current salary</p>
            <p className="mono" style={{ fontSize: 20, fontWeight: 600, color: AMBER, margin: 0 }}>₹{balance.toFixed(2)}</p>
          </div>
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Bonus %</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={bonusPct} onChange={e => setBonusPct(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={callProcedure}>EXEC apply_bonus (procedure)</button>
          <button className="btn-primary" style={{ width: "100%", marginTop: 8 }} onClick={callFunction}>SELECT calc_tax() (function)</button>
          <button className="btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={reset}>Reset</button>
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- try the procedure and the function", text: null }]} />
        <VivaCheck
          question="What's the fundamental difference between a stored procedure and a function in PL/SQL?"
          options={[["a", "There is no real difference"], ["b", "A function must return a value and is typically used inside a query; a procedure performs an action (like an UPDATE) and doesn't have to return anything", ], ["c", "Procedures can only read data, functions can only write data"]]}
          correctKey="b"
          explanation="A function is designed to compute and RETURN a single value, so it can be called directly inside a SELECT statement (like calc_tax() above). A procedure is for performing actions — often modifying data — and is invoked with EXEC rather than embedded in a query."
        />
      </>}
    />
  );
}
