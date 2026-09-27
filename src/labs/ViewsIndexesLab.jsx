import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const EMPLOYEES = Array.from({ length: 200 }, (_, i) => ({ emp_id: i + 1, name: `Employee${i + 1}`, dept: ["CS", "IT", "HR", "Finance"][i % 4], salary: 30000 + (i % 20) * 1500 }));

export default function ViewsIndexesLab({ setPage }) {
  const [log, setLog] = useState([]);
  const [hasIndex, setHasIndex] = useState(false);
  const [searchId, setSearchId] = useState(150);

  const createView = () => {
    const highEarners = EMPLOYEES.filter(e => e.salary > 55000).slice(0, 5);
    setLog(prev => [...prev, {
      code: "CREATE VIEW high_earners AS\nSELECT name, dept, salary FROM EMPLOYEE\nWHERE salary > 55000;\n\nSELECT * FROM high_earners;",
      table: highEarners,
    }]);
  };

  const createIndex = () => {
    setHasIndex(true);
    setLog(prev => [...prev, { code: "CREATE INDEX idx_emp_id ON EMPLOYEE(emp_id);", text: "Index created on emp_id." }]);
  };

  const searchById = () => {
    const scans = hasIndex ? Math.ceil(Math.log2(EMPLOYEES.length)) : EMPLOYEES.length;
    const found = EMPLOYEES.find(e => e.emp_id === searchId);
    setLog(prev => [...prev, {
      code: `SELECT * FROM EMPLOYEE WHERE emp_id = ${searchId};`,
      table: found ? [found] : [],
      text: `Rows scanned: ${scans} (${hasIndex ? "index lookup, ~log₂n" : "full table scan, O(n)"})`,
    }]);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 4"
      title="Views and indexes"
      aim="Aim: create a view to simplify a frequently-used query, then compare a full table scan against an indexed lookup when searching a 200-row employee table by ID."
      controls={<>
        <div className="card">
          <button className="btn-primary" style={{ width: "100%" }} onClick={createView}>CREATE VIEW high_earners</button>
        </div>
        <div className="card">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
            <input type="checkbox" checked={hasIndex} onChange={e => setHasIndex(e.target.checked)} />
            Index exists on emp_id
          </label>
          {!hasIndex && <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={createIndex}>CREATE INDEX idx_emp_id</button>}
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Search for emp_id</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={searchId} onChange={e => setSearchId(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", marginTop: 10 }} onClick={searchById}>Run SELECT ... WHERE emp_id = ?</button>
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- create the view, then try searching with and without the index", text: null }]} />
        <VivaCheck
          question="A view like high_earners is best described as:"
          options={[["a", "A physical copy of the data, duplicated and stored separately"], ["b", "A saved, named query — it runs the underlying SELECT fresh each time it's referenced, showing live data", ], ["c", "An index used to speed up searches"]]}
          correctKey="b"
          explanation="A view doesn't store data itself (unless materialized) — it's a stored query definition. Every time you SELECT from a view, the database re-runs the underlying query against the current table data, so results always stay live."
        />
      </>}
    />
  );
}
