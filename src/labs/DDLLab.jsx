import { useState } from "react";
import DBLabShell from "./dbms/DBLabShell";
import SqlConsole from "./dbms/SqlConsole";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function DDLLab({ setPage }) {
  const [schema, setSchema] = useState({});
  const [log, setLog] = useState([]);

  const createStudent = () => {
    setSchema(prev => ({ ...prev, STUDENT: ["roll_no INT PRIMARY KEY", "name VARCHAR(50) NOT NULL", "email VARCHAR(50) UNIQUE"] }));
    setLog(prev => [...prev, { code: "CREATE TABLE STUDENT (\n  roll_no INT PRIMARY KEY,\n  name VARCHAR(50) NOT NULL,\n  email VARCHAR(50) UNIQUE\n);", text: "Table STUDENT created." }]);
  };
  const createCourse = () => {
    setSchema(prev => ({ ...prev, COURSE: ["course_id INT PRIMARY KEY", "title VARCHAR(50)", "credits INT CHECK (credits > 0)"] }));
    setLog(prev => [...prev, { code: "CREATE TABLE COURSE (\n  course_id INT PRIMARY KEY,\n  title VARCHAR(50),\n  credits INT CHECK (credits > 0)\n);", text: "Table COURSE created." }]);
  };
  const createEnrollment = () => {
    if (!schema.STUDENT || !schema.COURSE) {
      setLog(prev => [...prev, { code: "CREATE TABLE ENROLLMENT (...);", text: "Error: STUDENT and COURSE must exist first (foreign key dependency).", isError: true }]);
      return;
    }
    setSchema(prev => ({ ...prev, ENROLLMENT: ["roll_no INT REFERENCES STUDENT(roll_no)", "course_id INT REFERENCES COURSE(course_id)", "PRIMARY KEY (roll_no, course_id)"] }));
    setLog(prev => [...prev, { code: "CREATE TABLE ENROLLMENT (\n  roll_no INT REFERENCES STUDENT(roll_no),\n  course_id INT REFERENCES COURSE(course_id),\n  PRIMARY KEY (roll_no, course_id)\n);", text: "Table ENROLLMENT created with two foreign keys." }]);
  };
  const alterAddColumn = () => {
    if (!schema.STUDENT) {
      setLog(prev => [...prev, { code: "ALTER TABLE STUDENT ADD phone VARCHAR(15);", text: "Error: STUDENT does not exist yet.", isError: true }]);
      return;
    }
    setSchema(prev => ({ ...prev, STUDENT: [...prev.STUDENT, "phone VARCHAR(15)"] }));
    setLog(prev => [...prev, { code: "ALTER TABLE STUDENT ADD phone VARCHAR(15);", text: "Column added to STUDENT." }]);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 2"
      title="DDL commands: creating a schema with constraints"
      aim="Aim: use CREATE TABLE with primary keys, NOT NULL, UNIQUE, and CHECK constraints, then link tables with foreign keys, and use ALTER TABLE to modify an existing table."
      controls={<>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={createStudent}>CREATE TABLE STUDENT</button>
          <button className="btn-primary" onClick={createCourse}>CREATE TABLE COURSE</button>
          <button className="btn-primary" onClick={createEnrollment}>CREATE TABLE ENROLLMENT (FKs)</button>
          <button className="btn-outline" onClick={alterAddColumn}>ALTER TABLE STUDENT ADD phone</button>
        </div>
      </>}
      results={<>
        <SqlConsole log={log.length ? log : [{ code: "-- create tables in order: STUDENT, COURSE, then ENROLLMENT", text: null }]} />
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Current schema</p>
          {Object.keys(schema).length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No tables yet.</p> : (
            Object.entries(schema).map(([table, cols]) => (
              <div key={table} style={{ marginBottom: 10 }}>
                <p className="mono" style={{ fontSize: 13, color: TEAL_DARK, fontWeight: 600, margin: "0 0 4px" }}>{table}</p>
                {cols.map((c, i) => <p key={i} className="mono" style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 2px 12px" }}>{c}</p>)}
              </div>
            ))
          )}
        </div>
        <VivaCheck
          question="Why does creating ENROLLMENT fail if STUDENT and COURSE don't exist yet?"
          options={[["a", "SQL requires tables to be created alphabetically"], ["b", "ENROLLMENT's foreign keys reference STUDENT and COURSE — the referenced tables (and their primary keys) must already exist for the reference to be valid", ], ["c", "It's a syntax error, unrelated to foreign keys"]]}
          correctKey="b"
          explanation="A foreign key constraint enforces referential integrity — it can only point to an existing primary key in another table. If STUDENT or COURSE doesn't exist yet, there's nothing valid for ENROLLMENT's foreign keys to reference."
        />
      </>}
    />
  );
}
