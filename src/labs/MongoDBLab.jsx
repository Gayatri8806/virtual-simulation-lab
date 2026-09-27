import { useState, useRef } from "react";
import DBLabShell from "./dbms/DBLabShell";
import VivaCheck from "./dbms/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const DEFAULT_DOCS = [
  { _id: 1, name: "Aarav", skills: ["Python", "SQL"], age: 20 },
  { _id: 2, name: "Priya", skills: ["Java", "MongoDB"], age: 21 },
];

export default function MongoDBLab({ setPage }) {
  const [docs, setDocs] = useState(DEFAULT_DOCS);
  const [log, setLog] = useState([]);
  const idRef = useRef(3);

  const insertOne = () => {
    const doc = { _id: idRef.current++, name: `Student${idRef.current}`, skills: ["JavaScript"], age: 19 + (idRef.current % 5) };
    setDocs(prev => [...prev, doc]);
    setLog(prev => [...prev, { code: `db.students.insertOne(${JSON.stringify(doc)})`, out: `Inserted with _id: ${doc._id}` }]);
  };

  const findAge = () => {
    const result = docs.filter(d => d.age >= 20);
    setLog(prev => [...prev, { code: 'db.students.find({ age: { $gte: 20 } })', out: JSON.stringify(result, null, 1) }]);
  };

  const updateOne = () => {
    if (docs.length === 0) return;
    const target = docs[0];
    setDocs(prev => prev.map(d => d._id === target._id ? { ...d, age: d.age + 1 } : d));
    setLog(prev => [...prev, { code: `db.students.updateOne({ _id: ${target._id} }, { $inc: { age: 1 } })`, out: `Matched 1, modified 1. New age: ${target.age + 1}` }]);
  };

  const deleteOne = () => {
    if (docs.length === 0) return;
    const target = docs[docs.length - 1];
    setDocs(prev => prev.filter(d => d._id !== target._id));
    setLog(prev => [...prev, { code: `db.students.deleteOne({ _id: ${target._id} })`, out: "Deleted count: 1" }]);
  };

  return (
    <DBLabShell
      setPage={setPage}
      unit="assignment 8"
      title="MongoDB: NoSQL CRUD operations"
      aim="Aim: perform Create, Read, Update, and Delete operations on a MongoDB-style document collection, and compare its schema-less document model with the fixed-schema relational tables used earlier."
      controls={<>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={insertOne}>insertOne()</button>
          <button className="btn-primary" onClick={findAge}>find({`{age: {$gte: 20}}`})</button>
          <button className="btn-primary" onClick={updateOne}>updateOne() — $inc age</button>
          <button className="btn-primary" onClick={deleteOne}>deleteOne() — last doc</button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>students collection</p>
          <pre className="mono" style={{ fontSize: 11.5, color: AMBER, background: "#0F1D27", padding: "12px 14px", borderRadius: 8, margin: 0, overflowX: "auto" }}>
{JSON.stringify(docs, null, 1)}
          </pre>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Console</p>
          <div className="mono" style={{ background: "#0F1D27", borderRadius: 8, padding: "12px 14px", fontSize: 12, maxHeight: 220, overflowY: "auto" }}>
            {log.length === 0 ? <span style={{ color: "#7C93A3" }}>// try a CRUD operation on the left</span> : log.map((e, i) => (
              <div key={i} style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
                <div style={{ color: "#7C93A3" }}>&gt; {e.code}</div>
                <div style={{ color: AMBER }}>{e.out}</div>
              </div>
            ))}
          </div>
        </div>
        <VivaCheck
          question="Unlike a relational table, a MongoDB collection's documents:"
          options={[["a", "Must all have exactly the same fields, just like table columns"], ["b", "Can each have a different structure — one document can have a field another doesn't, since there's no fixed schema enforced by the database", ], ["c", "Cannot store arrays or nested data"]]}
          correctKey="b"
          explanation="MongoDB is schema-less: each document in a collection can have its own set of fields. This flexibility is exactly why NoSQL databases suit unstructured or evolving data better than a rigid relational schema."
        />
      </>}
    />
  );
}
