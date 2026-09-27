import { useState } from "react";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function StringOpsLab({ setPage }) {
  const [str, setStr] = useState("malayalam");
  const [sub, setSub] = useState("ala");
  const [log, setLog] = useState([]);

  const runOp = (op) => {
    let code, out;
    if (op === "length") {
      code = `s = "${str}"\nprint(len(s))`;
      out = String(str.length);
    } else if (op === "reverse") {
      code = `s = "${str}"\nprint(s[::-1])`;
      out = `'${str.split("").reverse().join("")}'`;
    } else if (op === "palindrome") {
      const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
      const isPal = clean === clean.split("").reverse().join("");
      code = `s = "${str}"\nclean = s.lower().replace(" ", "")\nprint(clean == clean[::-1])`;
      out = String(isPal);
    } else if (op === "substring") {
      code = `s = "${str}"\nprint("${sub}" in s)`;
      out = String(str.includes(sub));
    }
    setLog(prev => [...prev, { code, out }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit III"
      title="String operations: length, reverse, palindrome, substring"
      aim="Aim: compute a string's length, reverse it, check whether it is a palindrome, and check whether it contains a given substring."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>String</label>
          <input className="field" style={{ marginTop: 6 }} value={str} onChange={e => setStr(e.target.value)} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Substring to search for</label>
          <input className="field" style={{ marginTop: 6 }} value={sub} onChange={e => setSub(e.target.value)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" onClick={() => runOp("length")}>len(s)</button>
            <button className="btn-primary" onClick={() => runOp("reverse")}>reverse s</button>
            <button className="btn-primary" onClick={() => runOp("palindrome")}>is palindrome?</button>
            <button className="btn-primary" onClick={() => runOp("substring")}>contains substring?</button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: 's = "malayalam"\nprint(len(s))', out: "9" }]} />
        <VivaCheck
          question="A string is a palindrome if:"
          options={[["a", "It's all lowercase"], ["b", "It reads the same forwards and backwards"], ["c", "It has an even number of characters"]]}
          correctKey="b"
          explanation="A palindrome is unchanged when reversed — checked here by comparing the cleaned string to its own reverse (clean == clean[::-1])."
        />
      </>}
    />
  );
}
