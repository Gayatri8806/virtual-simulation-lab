import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const STUDENTS = [
  { roll_no: 1, name: "Aarav", dept: "CS" },
  { roll_no: 2, name: "Priya", dept: "IT" },
  { roll_no: 3, name: "Rohan", dept: "CS" },
  { roll_no: 4, name: "Meera", dept: "ENTC" },
];
const MARKS = [
  { roll_no: 1, subject: "DBMS", marks: 82 },
  { roll_no: 1, subject: "OS", marks: 75 },
  { roll_no: 2, subject: "DBMS", marks: 91 },
  { roll_no: 3, subject: "DBMS", marks: 68 },
  { roll_no: 4, subject: "DBMS", marks: 95 },
];

export default function DMLQueriesLab({ setPage }) {
  const [log, setLog] = useState([]);

  const runJoin = () => {
    const result = MARKS.map(m => {
      const s = STUDENTS.find(s => s.roll_no === m.roll_no);
      return { name: s.name, subject: m.subject, marks: m.marks };
    });
    setLog(prev => [...prev, {
      code: "SELECT s.name, m.subject, m.marks\nFROM STUDENT s JOIN MARKS m ON s.roll_no = m.roll_no;",
      table: result,
    }]);
  };

  const runGroupBy = () => {
    const grouped = {};
    STUDENTS.forEach(s => { grouped[s.dept] = (grouped[s.dept] || 0) + 1; });
    const result = Object.entries(grouped).map(([dept, count]) => ({ dept, student_count: count }));
    setLog(prev => [...prev, {
      code: "SELECT dept, COUNT(*) AS student_count\nFROM STUDENT\nGROUP BY dept;",
      table: result,
    }]);
  };

  const runHaving = () => {
    const avgByRoll = {};
    MARKS.forEach(m => {
      avgByRoll[m.roll_no] = avgByRoll[m.roll_no] || [];
      avgByRoll[m.roll_no].push(m.marks);
    });
    const result = Object.entries(avgByRoll)
      .map(([roll, marks]) => ({ roll_no: Number(roll), avg_marks: marks.reduce((a, b) => a + b, 0) / marks.length }))
      .filter(r => r.avg_marks > 80)
      .map(r => ({ name: STUDENTS.find(s => s.roll_no === r.roll_no).name, avg_marks: r.avg_marks.toFixed(1) }));
    setLog(prev => [...prev, {
      code: "SELECT s.name, AVG(m.marks) AS avg_marks\nFROM STUDENT s JOIN MARKS m ON s.roll_no = m.roll_no\nGROUP BY s.name\nHAVING AVG(m.marks) > 80;",
      table: result,
    }]);
  };

  const runSubquery = () => {
    const maxMarks = Math.max(...MARKS.map(m => m.marks));
    const topRoll = MARKS.find(m => m.marks === maxMarks).roll_no;
    const topStudent = STUDENTS.find(s => s.roll_no === topRoll);
    setLog(prev => [...prev, {
      code: "SELECT name FROM STUDENT\nWHERE roll_no = (\n  SELECT roll_no FROM MARKS\n  WHERE marks = (SELECT MAX(marks) FROM MARKS)\n);",
      table: [{ name: topStudent.name }],
    }]);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 3"
      title="DML: joins, aggregate functions, GROUP BY / HAVING, subqueries"
      aim="Aim: query across two related tables (STUDENT, MARKS) using an inner join, group and aggregate results, filter groups with HAVING, and use a nested subquery to find the top scorer."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Sample data</p>
          <p className="mono" style={{ fontSize: 11.5, color: INK_SOFT, margin: 0 }}>STUDENT(roll_no, name, dept)<br/>MARKS(roll_no, subject, marks)</p>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={runJoin}>Run JOIN query</button>
          <button className="btn-primary" onClick={runGroupBy}>Run GROUP BY query</button>
          <button className="btn-primary" onClick={runHaving}>Run GROUP BY ... HAVING</button>
          <button className="btn-primary" onClick={runSubquery}>Run nested subquery</button>
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- pick a query type on the left", text: null }]} />
        <VivaCheck
          question="What's the key difference between WHERE and HAVING?"
          options={[["a", "They're interchangeable, no real difference"], ["b", "WHERE filters individual rows before grouping; HAVING filters groups after GROUP BY has aggregated them", ], ["c", "HAVING can only be used with JOIN, never with GROUP BY"]]}
          correctKey="b"
          explanation="WHERE operates on raw rows before any grouping happens, so it can't reference aggregate functions like AVG() or COUNT(). HAVING runs after GROUP BY, filtering the already-aggregated groups — which is why 'HAVING AVG(marks) > 80' works but 'WHERE AVG(marks) > 80' would not."
        />
      </>}
    />
  );
}
