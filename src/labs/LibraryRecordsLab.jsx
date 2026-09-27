import { useState } from "react";
import DSLabShell from "./ds/DSLabShell";
import PyShell from "./ds/PyShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const RECORDS = [3, 0, 5, 2, 0, 5, 1, 4, 0, 5, 2];

export default function LibraryRecordsLab({ setPage }) {
  const [log, setLog] = useState([]);

  const run = (op) => {
    let code, out;
    if (op === "avg") {
      const avg = RECORDS.reduce((a, b) => a + b, 0) / RECORDS.length;
      code = "sum(borrow_counts) / len(borrow_counts)";
      out = `${avg.toFixed(2)}  # O(n) time, O(1) space`;
    } else if (op === "maxmin") {
      code = "max(borrow_counts), min(borrow_counts)";
      out = `(${Math.max(...RECORDS)}, ${Math.min(...RECORDS)})  # O(n) time, O(1) space`;
    } else if (op === "zero") {
      const count = RECORDS.filter(x => x === 0).length;
      code = "sum(1 for x in borrow_counts if x == 0)";
      out = `${count}  # members who borrowed nothing`;
    } else if (op === "mode") {
      const freq = {};
      RECORDS.forEach(x => freq[x] = (freq[x] || 0) + 1);
      const mode = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
      code = "Counter(borrow_counts).most_common(1)";
      out = `[(${mode[0]}, ${mode[1]})]  # most frequently borrowed count`;
    }
    setLog(prev => [...prev, { code, out }]);
  };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group A &middot; arrays"
      title="Library borrowing records — array operations"
      aim="Aim: given each member's borrow count as an array, compute the average, the highest and lowest borrowers, how many borrowed nothing, and the most common borrow count — then note the time/space complexity of each."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Borrow counts array</p>
          <div className="mono" style={{ fontSize: 13, color: AMBER, background: "#0F1D27", padding: "10px 12px", borderRadius: 6 }}>
            [{RECORDS.join(", ")}]
          </div>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={() => run("avg")}>Average borrows</button>
          <button className="btn-primary" onClick={() => run("maxmin")}>Highest & lowest</button>
          <button className="btn-primary" onClick={() => run("zero")}>Members with 0 borrows</button>
          <button className="btn-primary" onClick={() => run("mode")}>Most frequent count (mode)</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# pick an operation on the left", out: null }]} />
        <VivaCheck
          question="Finding the average of n numbers by summing once and dividing takes:"
          options={[["a", "O(1) time"], ["b", "O(n) time"], ["c", "O(n²) time"]]}
          correctKey="b"
          explanation="A single pass through the array to sum all n elements is O(n) — you touch each element exactly once, regardless of array size."
        />
      </>}
    />
  );
}
