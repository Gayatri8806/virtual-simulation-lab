import { useState, useRef } from "react";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";

const OPS = [
  { id: "append", label: "append(value)", needs: ["value"] },
  { id: "insert", label: "insert(index, value)", needs: ["index", "value"] },
  { id: "remove", label: "remove(value)", needs: ["value"] },
  { id: "pop", label: "pop(index)", needs: ["indexOptional"] },
  { id: "sort", label: "sort()", needs: [] },
  { id: "reverse", label: "reverse()", needs: [] },
  { id: "index", label: "index(value)", needs: ["value"], query: true },
  { id: "count", label: "count(value)", needs: ["value"], query: true },
  { id: "slice", label: "list[start:end]", needs: ["start", "end"], query: true },
  { id: "clear", label: "clear()", needs: [] },
];

const INITIAL = [10, 20, 30, 40];

export default function ListOperationsLab({ setPage }) {
  const [list, setList] = useState(INITIAL);
  const [opId, setOpId] = useState("append");
  const [value, setValue] = useState("50");
  const [index, setIndex] = useState("1");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("2");
  const [log, setLog] = useState([
    { code: "my_list = [10, 20, 30, 40]", out: null },
  ]);
  const logEndRef = useRef(null);

  const op = OPS.find(o => o.id === opId);

  const pushLog = (code, out, isError = false) => {
    setLog(prev => [...prev, { code, out, isError }]);
  };

  const run = () => {
    const v = Number(value);
    const i = Number(index);
    const s = Number(start);
    const e = Number(end);

    try {
      switch (opId) {
        case "append": {
          setList(prev => [...prev, v]);
          pushLog(`my_list.append(${v})`, `# list is now [${[...list, v].join(", ")}]`);
          break;
        }
        case "insert": {
          if (i < 0 || i > list.length) throw new Error("index out of range for insert");
          const next = [...list.slice(0, i), v, ...list.slice(i)];
          setList(next);
          pushLog(`my_list.insert(${i}, ${v})`, `# list is now [${next.join(", ")}]`);
          break;
        }
        case "remove": {
          if (!list.includes(v)) throw new Error(`ValueError: ${v} is not in list`);
          const next = [...list];
          next.splice(next.indexOf(v), 1);
          setList(next);
          pushLog(`my_list.remove(${v})`, `# list is now [${next.join(", ")}]`);
          break;
        }
        case "pop": {
          if (list.length === 0) throw new Error("IndexError: pop from empty list");
          const idx = index.trim() === "" ? list.length - 1 : i;
          if (idx < 0 || idx >= list.length) throw new Error("IndexError: pop index out of range");
          const popped = list[idx];
          const next = list.filter((_, k) => k !== idx);
          setList(next);
          pushLog(index.trim() === "" ? "my_list.pop()" : `my_list.pop(${idx})`, `# popped ${popped}, list is now [${next.join(", ")}]`);
          break;
        }
        case "sort": {
          const next = [...list].sort((a, b) => a - b);
          setList(next);
          pushLog("my_list.sort()", `# list is now [${next.join(", ")}]`);
          break;
        }
        case "reverse": {
          const next = [...list].reverse();
          setList(next);
          pushLog("my_list.reverse()", `# list is now [${next.join(", ")}]`);
          break;
        }
        case "index": {
          if (!list.includes(v)) throw new Error(`ValueError: ${v} is not in list`);
          pushLog(`my_list.index(${v})`, list.indexOf(v));
          break;
        }
        case "count": {
          pushLog(`my_list.count(${v})`, list.filter(x => x === v).length);
          break;
        }
        case "slice": {
          pushLog(`my_list[${s}:${e}]`, `[${list.slice(s, e).join(", ")}]`);
          break;
        }
        case "clear": {
          setList([]);
          pushLog("my_list.clear()", "# list is now []");
          break;
        }
        default:
          break;
      }
    } catch (err) {
      pushLog(
        opId === "slice" ? `my_list[${s}:${e}]` : `my_list.${opId}(${op.needs.includes("value") ? v : ""}${op.needs.includes("index") ? i : ""})`,
        err.message,
        true
      );
    }
  };

  const reset = () => {
    setList(INITIAL);
    setLog([{ code: "my_list = [10, 20, 30, 40]", out: null }]);
  };

  const [quizAnswer, setQuizAnswer] = useState(null);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-programming")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to programming labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>programming for problem solving &middot; unit II</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>Program to demonstrate operations on a list</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: write a Python program to perform append, insert, remove, pop, sort, reverse and slicing operations on a list, and observe the result after each operation.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Current list</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", minHeight: 40 }}>
              {list.length === 0 && <span style={{ fontSize: 13, color: INK_SOFT }}>[] (empty)</span>}
              {list.map((val, idx) => (
                <div key={idx} style={{ textAlign: "center" }}>
                  <div className="mono" style={{ background: "#0F1D27", color: AMBER, border: "1.5px solid #2E6F63", borderRadius: 6, padding: "8px 10px", fontSize: 14, fontWeight: 600, minWidth: 32 }}>{val}</div>
                  <div className="mono" style={{ fontSize: 10, color: INK_SOFT, marginTop: 2 }}>{idx}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Operation</label>
            <select className="field" value={opId} onChange={e => setOpId(e.target.value)}>
              {OPS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>

            {op.needs.includes("value") && (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Value</label>
                <input className="field" style={{ marginTop: 6 }} type="number" value={value} onChange={e => setValue(e.target.value)} />
              </>
            )}
            {op.needs.includes("index") && (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Index</label>
                <input className="field" style={{ marginTop: 6 }} type="number" value={index} onChange={e => setIndex(e.target.value)} />
              </>
            )}
            {op.needs.includes("indexOptional") && (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Index (leave blank for last item)</label>
                <input className="field" style={{ marginTop: 6 }} type="number" value={index} onChange={e => setIndex(e.target.value)} placeholder="last item" />
              </>
            )}
            {op.needs.includes("start") && (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Start</label>
                <input className="field" style={{ marginTop: 6 }} type="number" value={start} onChange={e => setStart(e.target.value)} />
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>End</label>
                <input className="field" style={{ marginTop: 6 }} type="number" value={end} onChange={e => setEnd(e.target.value)} />
              </>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={run}>Run</button>
              <button className="btn-outline" onClick={reset} title="Reset list"><RotateCcw size={15} /></button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Python shell</p>
            <div className="mono" style={{ background: "#0F1D27", borderRadius: 8, padding: "14px 16px", fontSize: 13, maxHeight: 340, overflowY: "auto" }}>
              {log.map((entry, idx) => (
                <div key={idx} style={{ marginBottom: 8 }}>
                  <div style={{ color: "#7C93A3" }}>&gt;&gt;&gt; {entry.code}</div>
                  {entry.out !== null && (
                    <div style={{ color: entry.isError ? "#E08A7D" : AMBER }}>{entry.out}</div>
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Program used</p>
            <pre className="mono" style={{ background: "#0F1D27", color: "#E4EFEC", borderRadius: 8, padding: "14px 16px", fontSize: 12.5, overflowX: "auto", margin: 0 }}>
{`my_list = [10, 20, 30, 40]
my_list.append(50)
my_list.insert(1, 15)
my_list.remove(30)
my_list.pop()
my_list.sort()
my_list.reverse()
print(my_list)`}
            </pre>
            <p style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 8 }}>Try each operation on the left, one at a time, and watch the shell log build up the equivalent of running this program line by line.</p>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>What is the key difference between <code>remove(value)</code> and <code>pop(index)</code>?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
              {[
                ["a", "They do exactly the same thing"],
                ["b", "remove() deletes by value, pop() deletes by index (and returns the removed item)"],
                ["c", "pop() only works on tuples"],
              ].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined, textAlign: "left" }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "flex-start", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} /> : <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
                <span>{quizCorrect ? "Correct." : "Not quite."} remove(value) searches for and deletes the first matching value (ValueError if absent); pop(index) deletes by position and returns the removed value (defaults to the last item).</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
