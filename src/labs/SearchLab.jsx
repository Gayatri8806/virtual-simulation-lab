import { useState } from "react";
import DSLabShell from "./ds/DSLabShell";
import PyShell from "./ds/PyShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const IDS_UNSORTED = [4021, 1187, 6659, 2233, 8890, 3345, 7712, 5566, 9901, 1023];
const IDS_SORTED = [...IDS_UNSORTED].sort((a, b) => a - b);

export default function SearchLab({ setPage }) {
  const [target, setTarget] = useState(7712);
  const [log, setLog] = useState([]);

  const linearSearch = () => {
    let steps = 0, found = -1;
    for (let i = 0; i < IDS_UNSORTED.length; i++) {
      steps++;
      if (IDS_UNSORTED[i] === target) { found = i; break; }
    }
    setLog(prev => [...prev, {
      code: `linear_search(account_ids, ${target})`,
      out: found >= 0 ? `Found at index ${found} in ${steps} comparisons  # O(n) worst case` : `Not found after ${steps} comparisons`,
    }]);
  };

  const binarySearch = () => {
    let lo = 0, hi = IDS_SORTED.length - 1, steps = 0, found = -1;
    while (lo <= hi) {
      steps++;
      const mid = Math.floor((lo + hi) / 2);
      if (IDS_SORTED[mid] === target) { found = mid; break; }
      if (IDS_SORTED[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    setLog(prev => [...prev, {
      code: `binary_search(sorted_ids, ${target})`,
      out: found >= 0 ? `Found at index ${found} in ${steps} comparisons  # O(log n) worst case` : `Not found after ${steps} comparisons`,
    }]);
  };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group A &middot; searching"
      title="Linear search vs. binary search on customer IDs"
      aim="Aim: search for a customer account ID using linear search (unsorted array) and binary search (sorted array), and compare how many comparisons each needs."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Unsorted IDs</p>
          <div className="mono" style={{ fontSize: 12.5, color: AMBER }}>[{IDS_UNSORTED.join(", ")}]</div>
          <p style={{ fontWeight: 600, fontSize: 13, margin: "12px 0 6px" }}>Sorted IDs</p>
          <div className="mono" style={{ fontSize: 12.5, color: AMBER }}>[{IDS_SORTED.join(", ")}]</div>
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Target ID to search for</label>
          <select className="field" style={{ marginTop: 6 }} value={target} onChange={e => setTarget(Number(e.target.value))}>
            {IDS_UNSORTED.map(id => <option key={id} value={id}>{id}</option>)}
            <option value={9999}>9999 (not in list)</option>
          </select>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button className="btn-primary" onClick={linearSearch}>Run linear search</button>
            <button className="btn-primary" onClick={binarySearch}>Run binary search</button>
          </div>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# choose a target ID and run either search", out: null }]} />
        <VivaCheck
          question="Binary search requires the array to be:"
          options={[["a", "Sorted"], ["b", "A linked list"], ["c", "Of even length"]]}
          correctKey="a"
          explanation="Binary search relies on repeatedly halving the search range by comparing against the middle element — that logic only works correctly if the array is already sorted."
        />
      </>}
    />
  );
}
