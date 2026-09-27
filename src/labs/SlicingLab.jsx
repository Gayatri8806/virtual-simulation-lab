import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

function pySlice(str, start, end, step) {
  const s = start === "" ? undefined : Number(start);
  const e = end === "" ? undefined : Number(end);
  const st = step === "" ? 1 : Number(step);
  const arr = str.split("");
  const len = arr.length;
  const norm = (v, dflt) => {
    if (v === undefined) return dflt;
    return v < 0 ? Math.max(len + v, 0) : Math.min(v, len);
  };
  let result = [];
  if (st > 0) {
    const a = norm(s, 0), b = norm(e, len);
    for (let i = a; i < b; i += st) result.push(arr[i]);
  } else if (st < 0) {
    const a = s === undefined ? len - 1 : (s < 0 ? len + s : s);
    const b = e === undefined ? -1 : (e < 0 ? len + e : e);
    for (let i = a; i > b; i += st) result.push(arr[i]);
  }
  return result.join("");
}

export default function SlicingLab({ setPage }) {
  const [str, setStr] = useState("hello world");
  const [start, setStart] = useState("0");
  const [end, setEnd] = useState("5");
  const [step, setStep] = useState("1");
  const [log, setLog] = useState([]);

  const run = () => {
    const out = pySlice(str, start, end, step);
    setLog(prev => [...prev, { code: `s = "${str}"\nprint(s[${start}:${end}:${step}])`, out: `'${out}'` }]);
  };

  const presets = [
    { label: "s[0:5]", start: "0", end: "5", step: "1" },
    { label: "s[::-1] (reverse)", start: "", end: "", step: "-1" },
    { label: "s[6:]", start: "6", end: "", step: "1" },
    { label: "s[::2]", start: "", end: "", step: "2" },
  ];

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit III"
      title="String slicing operations"
      aim="Aim: use Python's slice notation s[start:end:step] to extract substrings, reverse a string, and skip characters."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>String</label>
          <input className="field" style={{ marginTop: 6 }} value={str} onChange={e => setStr(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>start</label>
          <input className="field" style={{ marginTop: 6 }} value={start} onChange={e => setStart(e.target.value)} placeholder="(blank = start)" />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>end</label>
          <input className="field" style={{ marginTop: 6 }} value={end} onChange={e => setEnd(e.target.value)} placeholder="(blank = end)" />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>step</label>
          <input className="field" style={{ marginTop: 6 }} value={step} onChange={e => setStep(e.target.value)} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={run}>Run</button>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 14 }}>
            {presets.map(p => (
              <button key={p.label} className="btn-outline" style={{ fontSize: 12.5 }} onClick={() => { setStart(p.start); setEnd(p.end); setStep(p.step); }}>{p.label}</button>
            ))}
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: 's = "hello world"\nprint(s[0:5])', out: "'hello'" }]} />
        <VivaCheck
          question="What does s[::-1] do to a string s?"
          options={[["a", "Deletes it"], ["b", "Reverses it"], ["c", "Uppercases it"]]}
          correctKey="b"
          explanation="A step of -1 with no start/end walks the string backward from the last character to the first, producing the reverse of the string."
        />
      </>}
    />
  );
}
