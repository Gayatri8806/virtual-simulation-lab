import { useState } from "react";
import { RotateCcw } from "lucide-react";
import DSLabShell from "./ds/DSLabShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function UndoRedoStackLab({ setPage }) {
  const [doc, setDoc] = useState("Hello");
  const [input, setInput] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const makeChange = () => {
    if (!input.trim()) return;
    setUndoStack(prev => [...prev, doc]);
    setRedoStack([]);
    setDoc(prev => prev + input);
    setInput("");
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const prevState = undoStack[undoStack.length - 1];
    setRedoStack(r => [...r, doc]);
    setDoc(prevState);
    setUndoStack(u => u.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(u => [...u, doc]);
    setDoc(nextState);
    setRedoStack(r => r.slice(0, -1));
  };

  const reset = () => { setDoc("Hello"); setUndoStack([]); setRedoStack([]); setInput(""); };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group B &middot; stacks"
      title="Undo/redo text editor using a Stack"
      aim="Aim: implement undo and redo for a text editor using two stacks — every change pushes the previous state onto the undo stack; undoing pops it back and pushes the current state onto the redo stack."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Text to append</label>
          <input className="field" style={{ marginTop: 6 }} value={input} onChange={e => setInput(e.target.value)} placeholder="type something..." />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 10 }} onClick={makeChange}>Make change (append)</button>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn-outline" style={{ flex: 1 }} onClick={undo} disabled={undoStack.length === 0}>Undo</button>
            <button className="btn-outline" style={{ flex: 1 }} onClick={redo} disabled={redoStack.length === 0}>Redo</button>
          </div>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset document</button>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Document state</p>
          <div className="mono" style={{ background: "#0F1D27", color: AMBER, padding: "12px 14px", borderRadius: 8, fontSize: 14, minHeight: 24 }}>{doc || "(empty)"}</div>
        </div>
        <div className="card" style={{ display: "flex", gap: 20 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12.5, color: INK_SOFT, marginBottom: 6 }}>Undo stack (top → bottom)</p>
            {undoStack.length === 0 ? <p style={{ fontSize: 12, color: INK_SOFT }}>empty</p> : (
              <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4 }}>
                {undoStack.map((s, i) => <div key={i} className="mono" style={{ fontSize: 11, background: "#0F1D27", color: TEAL_DARK, padding: "4px 8px", borderRadius: 4 }}>{s || "(empty)"}</div>)}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12.5, color: INK_SOFT, marginBottom: 6 }}>Redo stack (top → bottom)</p>
            {redoStack.length === 0 ? <p style={{ fontSize: 12, color: INK_SOFT }}>empty</p> : (
              <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4 }}>
                {redoStack.map((s, i) => <div key={i} className="mono" style={{ fontSize: 11, background: "#0F1D27", color: "#E24B3D", padding: "4px 8px", borderRadius: 4 }}>{s || "(empty)"}</div>)}
              </div>
            )}
          </div>
        </div>
        <VivaCheck
          question="Why does making a NEW change after an undo clear the redo stack?"
          options={[["a", "It's an arbitrary implementation choice with no reason"], ["b", "The old 'future' states are no longer valid once a different change branches off from the current point", ], ["c", "Stacks can only hold one item at a time"]]}
          correctKey="b"
          explanation="Redo represents 'states you undid but could restore.' If you make a fresh change instead of redoing, you've created a new timeline — the old redo states no longer follow logically from where you are now, so they're discarded."
        />
      </>}
    />
  );
}
