import { useState, useRef } from "react";
import { RotateCcw } from "lucide-react";
import DSLabShell from "./ds/DSLabShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function CallCenterQueueLab({ setPage }) {
  const [queue, setQueue] = useState([]);
  const [answered, setAnswered] = useState([]);
  const idRef = useRef(1);

  const addCall = () => {
    const id = idRef.current++;
    setQueue(prev => [...prev, { id, customer: `Customer-${id}`, time: new Date().toLocaleTimeString() }]);
  };

  const answerCall = () => {
    if (queue.length === 0) return;
    setAnswered(prev => [...prev, queue[0]]);
    setQueue(prev => prev.slice(1));
  };

  const cancelCall = (id) => setQueue(prev => prev.filter(c => c.id !== id));
  const reset = () => { setQueue([]); setAnswered([]); };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group B &middot; queues"
      title="Call center queue simulation using a Queue"
      aim="Aim: simulate a call center's queue — calls are added at the back and answered strictly in the order they arrived (FIFO), with the ability to view pending calls or cancel one before it's answered."
      controls={<>
        <div className="card">
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={addCall}>Incoming call (addCall)</button>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={answerCall} disabled={queue.length === 0}>Answer next call</button>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset</button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Pending queue (front &rarr; back)</p>
          {queue.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No calls waiting.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {queue.map((c, i) => (
                <div key={c.id} className="mono" style={{ fontSize: 12.5, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F1D27", color: i === 0 ? AMBER : "#B8C2C8", padding: "6px 10px", borderRadius: 6 }}>
                  <span>{i === 0 ? "→ " : ""}{c.customer} ({c.time}){i === 0 ? " [next]" : ""}</span>
                  <button onClick={() => cancelCall(c.id)} style={{ background: "none", border: "none", color: "#E24B3D", cursor: "pointer", fontSize: 11 }}>cancel</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Answered ({answered.length})</p>
          {answered.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>None yet.</p> : (
            <p style={{ fontSize: 12.5, color: TEAL_DARK }} className="mono">{answered.map(c => c.customer).join(", ")}</p>
          )}
        </div>
        <VivaCheck
          question="What does FIFO stand for, and why does it describe a call queue?"
          options={[["a", "First In, First Out — the first caller to arrive is the first one answered"], ["b", "Fast In, Fast Out — calls are processed instantly"], ["c", "Final In, First Out — the newest caller is answered first"]]}
          correctKey="a"
          explanation="A queue processes items in the exact order they arrived — First In, First Out. This is exactly the fairness a call center needs: whoever called first gets answered first."
        />
      </>}
    />
  );
}
