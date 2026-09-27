import { useState } from "react";
import { INK_SOFT } from "../constants";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

const DEFAULT_SRC = "Hello, World! Python is Fun.";

export default function FileCopyLab({ setPage }) {
  const [src, setSrc] = useState(DEFAULT_SRC);
  const [mode, setMode] = useState("upper");
  const [log, setLog] = useState([]);

  const transform = (text) => {
    if (mode === "upper") return text.toUpperCase();
    if (mode === "lower") return text.toLowerCase();
    return text.replace(/[^\w\s]/g, "");
  };

  const codeFor = () => {
    if (mode === "upper") return `dest.write(line.upper())`;
    if (mode === "lower") return `dest.write(line.lower())`;
    return `import string\ndest.write(line.translate(str.maketrans('', '', string.punctuation)))`;
  };

  const run = () => {
    const out = transform(src);
    setLog(prev => [...prev, {
      code: `with open("source.txt") as src, open("dest.txt", "w") as dest:\n    for line in src:\n        ${codeFor()}\n\nprint(open("dest.txt").read())`,
      out,
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit IV"
      title="Copy file with case & punctuation transforms"
      aim="Aim: read from a source file, apply a transform (uppercase, lowercase, or strip punctuation) line by line, and write the result to a destination file."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>source.txt (simulated)</label>
          <textarea className="field" style={{ marginTop: 6 }} rows={3} value={src} onChange={e => setSrc(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Transform</label>
          <select className="field" style={{ marginTop: 6 }} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="upper">Convert to UPPERCASE</option>
            <option value="lower">Convert to lowercase</option>
            <option value="strip">Strip punctuation</option>
          </select>
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={run}>Run</button>
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>dest.txt starts empty and is written fresh each run.</p>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# choose a transform and click Run", out: null }]} />
        <VivaCheck
          question={`Opening a file with mode "w" (instead of "a") means:`}
          options={[["a", "Appends to the end of the existing file"], ["b", "Overwrites the file, starting it empty"], ["c", "Opens the file as read-only"]]}
          correctKey="b"
          explanation={`"w" mode truncates the file to zero length (or creates it) before writing — use "a" instead if you want to append to existing content.`}
        />
      </>}
    />
  );
}
