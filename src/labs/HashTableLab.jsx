import { useState } from "react";
import { RotateCcw } from "lucide-react";
import DSLabShell from "./ds/DSLabShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const SIZE = 10;

export default function HashTableLab({ setPage }) {
  const [buckets, setBuckets] = useState(Array.from({ length: SIZE }, () => []));
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [lastOp, setLastOp] = useState(null);

  const hash = (k) => {
    const n = Number(k);
    if (!isNaN(n)) return ((n % SIZE) + SIZE) % SIZE;
    let sum = 0;
    for (const c of String(k)) sum += c.charCodeAt(0);
    return sum % SIZE;
  };

  const insert = () => {
    if (!key.trim()) return;
    const idx = hash(key);
    setBuckets(prev => {
      const next = prev.map(b => [...b]);
      const existing = next[idx].findIndex(([k]) => k === key);
      if (existing >= 0) next[idx][existing] = [key, value];
      else next[idx].push([key, value]);
      return next;
    });
    setLastOp(`insert("${key}") → bucket[${idx}]${buckets[idx].length > 0 ? " (collision, chained)" : ""}`);
    setKey(""); setValue("");
  };

  const search = () => {
    if (!key.trim()) return;
    const idx = hash(key);
    const found = buckets[idx].find(([k]) => k === key);
    setLastOp(found ? `search("${key}") → found "${found[1]}" in bucket[${idx}]` : `search("${key}") → not found (checked bucket[${idx}])`);
  };

  const remove = () => {
    if (!key.trim()) return;
    const idx = hash(key);
    setBuckets(prev => {
      const next = prev.map(b => [...b]);
      next[idx] = next[idx].filter(([k]) => k !== key);
      return next;
    });
    setLastOp(`delete("${key}") → removed from bucket[${idx}]`);
  };

  const reset = () => { setBuckets(Array.from({ length: SIZE }, () => [])); setLastOp(null); };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group C &middot; hashing"
      title="Hash table with chaining (division method)"
      aim="Aim: implement a hash table of size 10 using the division method (key mod 10) as the hash function, resolving collisions by chaining — supporting insert, search, and delete."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Key</label>
          <input className="field" style={{ marginTop: 6 }} value={key} onChange={e => setKey(e.target.value)} placeholder="e.g. 23 or 'apple'" />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 12 }}>Value</label>
          <input className="field" style={{ marginTop: 6 }} value={value} onChange={e => setValue(e.target.value)} placeholder="associated value" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button className="btn-primary" onClick={insert}>Insert</button>
            <button className="btn-primary" onClick={search}>Search</button>
            <button className="btn-primary" onClick={remove}>Delete</button>
          </div>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Clear table</button>
        </div>
      </>}
      results={<>
        {lastOp && (
          <div className="card">
            <p className="mono" style={{ fontSize: 12.5, color: AMBER, margin: 0 }}>{lastOp}</p>
          </div>
        )}
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Hash table (10 buckets)</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {buckets.map((bucket, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="mono" style={{ fontSize: 12, color: INK_SOFT, width: 60 }}>[{i}]</span>
                {bucket.length === 0 ? (
                  <span className="mono" style={{ fontSize: 11, color: "#5C7686" }}>empty</span>
                ) : (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {bucket.map(([k, v], j) => (
                      <span key={j} className="mono" style={{ fontSize: 11.5, background: "#0F1D27", color: TEAL_DARK, padding: "3px 8px", borderRadius: 4 }}>{k}:{v || "—"}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <VivaCheck
          question="In chaining, when two keys hash to the same bucket index, what happens?"
          options={[["a", "The second key overwrites the first, losing data"], ["b", "Both keys are stored in a list at that bucket, appended one after another"], ["c", "The table immediately doubles in size"]]}
          correctKey="b"
          explanation="Chaining resolves collisions by letting each bucket hold a list (chain) of key-value pairs instead of just one. Both keys that hash to the same index simply live in the same bucket's list."
        />
      </>}
    />
  );
}
