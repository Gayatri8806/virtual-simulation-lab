import { useState, useRef } from "react";
import { RotateCcw, ArrowRight } from "lucide-react";
import DSLabShell from "./ds/DSLabShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function LinkedListLab({ setPage }) {
  const [nodes, setNodes] = useState([
    { id: 1, roll: 101, name: "Aarav", marks: 78 },
    { id: 2, roll: 102, name: "Priya", marks: 92 },
    { id: 3, roll: 103, name: "Rohan", marks: 65 },
  ]);
  const [roll, setRoll] = useState(104);
  const [name, setName] = useState("");
  const [marks, setMarks] = useState(80);
  const idRef = useRef(4);

  const add = () => {
    if (!name.trim()) return;
    setNodes(prev => [...prev, { id: idRef.current++, roll, name, marks }]);
    setName("");
  };
  const remove = (id) => setNodes(prev => prev.filter(n => n.id !== id));
  const sortByMarks = () => setNodes(prev => [...prev].sort((a, b) => b.marks - a.marks));
  const sortByRoll = () => setNodes(prev => [...prev].sort((a, b) => a.roll - b.roll));
  const reset = () => setNodes([
    { id: 1, roll: 101, name: "Aarav", marks: 78 },
    { id: 2, roll: 102, name: "Priya", marks: 92 },
    { id: 3, roll: 103, name: "Rohan", marks: 65 },
  ]);

  return (
    <DSLabShell
      setPage={setPage}
      group="Group B &middot; linked lists"
      title="Student record management using a linked list"
      aim="Aim: maintain student records (roll number, name, marks) as a singly linked list, supporting add, delete, search, and sort by marks or roll number."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Roll no.</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={roll} onChange={e => setRoll(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Name</label>
          <input className="field" style={{ marginTop: 6 }} value={name} onChange={e => setName(e.target.value)} placeholder="Student name" />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Marks</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={marks} onChange={e => setMarks(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} onClick={add}>Insert node (append)</button>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={sortByRoll}>Sort by roll</button>
            <button className="btn-outline" style={{ flex: 1 }} onClick={sortByMarks}>Sort by marks</button>
          </div>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset list</button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Linked list (head &rarr; tail)</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {nodes.map((n, i) => (
              <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="mono" style={{ background: "#0F1D27", border: `1.5px solid ${TEAL_DARK}`, borderRadius: 6, padding: "8px 10px", fontSize: 11.5, color: AMBER, minWidth: 100 }}>
                  <div>#{n.roll} {n.name}</div>
                  <div style={{ color: "#7C93A3" }}>marks: {n.marks}</div>
                  <div style={{ color: "#E24B3D", cursor: "pointer", marginTop: 4 }} onClick={() => remove(n.id)}>delete</div>
                </div>
                {i < nodes.length - 1 ? <ArrowRight size={16} color="#5C7686" /> : <span className="mono" style={{ fontSize: 11, color: "#5C7686" }}>→ null</span>}
              </div>
            ))}
            {nodes.length === 0 && <span className="mono" style={{ fontSize: 12, color: INK_SOFT }}>head → null (empty list)</span>}
          </div>
        </div>
        <VivaCheck
          question="Why is inserting at the head of a linked list O(1), while inserting at the head of an array is O(n)?"
          options={[["a", "Linked lists don't actually store data"], ["b", "A linked list just repoints the head pointer, but an array must shift every existing element over by one", ], ["c", "Arrays and linked lists perform identically"]]}
          correctKey="b"
          explanation="Inserting at the front of a linked list only means creating a new node and pointing it at the old head — one operation. An array insertion at the front requires physically shifting every other element one position to the right, which takes O(n) time."
        />
      </>}
    />
  );
}
