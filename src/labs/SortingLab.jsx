import { useState } from "react";
import DSLabShell from "./ds/DSLabShell";
import PyShell from "./ds/PyShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const SALARIES = [45230.5, 38900.0, 62100.75, 29800.0, 71200.25, 34500.5, 58300.0, 41200.75, 67800.0, 32100.25];

function selectionSort(arr) {
  const a = [...arr]; let comparisons = 0;
  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      if (a[j] < a[minIdx]) minIdx = j;
    }
    [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return { sorted: a, comparisons };
}

function bubbleSort(arr) {
  const a = [...arr]; let comparisons = 0;
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - 1 - i; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
  }
  return { sorted: a, comparisons };
}

export default function SortingLab({ setPage }) {
  const [log, setLog] = useState([]);

  const run = (which) => {
    const { sorted, comparisons } = which === "selection" ? selectionSort(SALARIES) : bubbleSort(SALARIES);
    const top5 = [...sorted].reverse().slice(0, 5);
    setLog(prev => [...prev, {
      code: `${which}_sort(salaries)\nprint(sorted_salaries[-5:][::-1])  # top 5`,
      out: `${comparisons} comparisons\nTop 5: [${top5.map(s => s.toFixed(2)).join(", ")}]`,
    }]);
  };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group A &middot; sorting"
      title="Sorting employee salaries — selection sort vs. bubble sort"
      aim="Aim: sort a list of employee salaries in ascending order using selection sort and bubble sort, display the top 5 highest salaries, and compare the number of comparisons each algorithm makes."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Salaries (unsorted)</p>
          <div className="mono" style={{ fontSize: 12, color: AMBER }}>[{SALARIES.map(s => s.toFixed(1)).join(", ")}]</div>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn-primary" onClick={() => run("selection")}>Run selection sort</button>
          <button className="btn-primary" onClick={() => run("bubble")}>Run bubble sort</button>
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# run either sort to see comparisons and the top 5 salaries", out: null }]} />
        <VivaCheck
          question="Both selection sort and bubble sort have worst-case time complexity of:"
          options={[["a", "O(n)"], ["b", "O(n log n)"], ["c", "O(n²)"]]}
          correctKey="c"
          explanation="Both use nested loops comparing pairs of elements across the whole array — roughly n²/2 comparisons in the worst case, which is O(n²). This is why they're taught as simple but inefficient sorts for large data."
        />
      </>}
    />
  );
}
