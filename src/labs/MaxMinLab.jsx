import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV BX, OFFSET ARRAY",
  "MOV AL, [BX]        ; AL = max = min so far",
  "MOV AH, [BX]",
  "MOV CX, N-1",
  "NEXT: INC BX",
  "CMP [BX], AL",
  "JLE CHECK_MIN",
  "MOV AL, [BX]        ; new max",
  "CHECK_MIN: CMP [BX], AH",
  "JGE LOOP_END",
  "MOV AH, [BX]        ; new min",
  "LOOP_END: DEC CX",
  "JNZ NEXT",
  "HLT",
];

const ARRAY = [34, 82, 15, 91, 47, 6, 58];

export default function MaxMinLab({ setPage }) {
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    let max = ARRAY[0], min = ARRAY[0];
    const trace = [
      { line: 0, ax: 0, bx: 0, cx: 0, dx: 0, memory: ARRAY, note: "BX points to array start" },
      { line: 1, ax: max, bx: 0, cx: 0, dx: 0, memory: ARRAY, highlight: [0], note: `AL = max = ${max}` },
      { line: 2, ax: max, bx: 0, cx: 0, dx: 0, memory: ARRAY, highlight: [0], note: `AH = min = ${min}` },
    ];
    for (let i = 1; i < ARRAY.length; i++) {
      const val = ARRAY[i];
      let note = `compare index ${i} (${val})`;
      if (val > max) { max = val; note += " -> new max"; }
      if (val < min) { min = val; note += " -> new min"; }
      trace.push({ line: 5, ax: max, bx: i, cx: ARRAY.length - i, dx: 0, memory: ARRAY, highlight: [i], note });
    }
    trace.push({ line: 13, ax: max, bx: ARRAY.length - 1, cx: 0, dx: min, memory: ARRAY, note: `done: max=${max} (AL), min=${min} (AH, shown as DX here)` });
    return trace;
  }, []);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 4"
      title="Largest and smallest number in an array"
      aim="Aim: write an 8086 assembly program to scan through an array once and simultaneously track both the largest and smallest values found so far."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <RegisterPanel step={steps[idx]} />
        <p style={{ fontSize: 11.5, color: INK_SOFT }}>Array: [{ARRAY.join(", ")}]</p>
        <VivaCheck
          question="This program finds both max and min in a single pass through the array. What's its time complexity?"
          options={[["a", "O(1)"], ["b", "O(n) — one comparison pass touching each element once"], ["c", "O(n²)"]]}
          correctKey="b"
          explanation="Each element is visited exactly once, with a constant amount of comparison work per element (checking against current max and min) — that's linear time, O(n), regardless of array size."
        />
      </>}
    />
  );
}
