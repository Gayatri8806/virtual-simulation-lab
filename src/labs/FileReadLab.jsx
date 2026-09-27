import { useState } from "react";
import { INK_SOFT } from "../constants";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

const DEFAULT_FILE = "Hello Python\nThis is line two.\nFile handling is easy!";

export default function FileReadLab({ setPage }) {
  const [fileContent, setFileContent] = useState(DEFAULT_FILE);
  const [log, setLog] = useState([]);

  const runRead = () => {
    setLog(prev => [...prev, {
      code: `with open("notes.txt", "r") as f:\n    print(f.read())`,
      out: fileContent,
    }]);
  };
  const runReadlines = () => {
    const lines = fileContent.split("\n");
    setLog(prev => [...prev, {
      code: `with open("notes.txt", "r") as f:\n    for line in f:\n        print(line.strip())`,
      out: lines.join("\n"),
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit IV"
      title="Read and display file contents"
      aim="Aim: open a text file and read/display its contents, both as one block and line by line, using Python's file handling."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>notes.txt (simulated file)</label>
          <textarea className="field" style={{ marginTop: 6 }} rows={6} value={fileContent} onChange={e => setFileContent(e.target.value)} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 6 }}>Edit this like you would edit a real text file, then read it back below.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <button className="btn-primary" onClick={runRead}>f.read()</button>
            <button className="btn-primary" onClick={runReadlines}>loop line by line</button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: 'with open("notes.txt") as f:\n    print(f.read())', out: DEFAULT_FILE }]} />
        <VivaCheck
          question="Why is 'with open(...) as f:' preferred over just f = open(...)?"
          options={[["a", "It's shorter to type"], ["b", "It automatically closes the file afterward, even if an error occurs"], ["c", "It reads faster"]]}
          correctKey="b"
          explanation="The with statement is a context manager — it guarantees f.close() runs automatically once the block ends, preventing file-handle leaks."
        />
      </>}
    />
  );
}
