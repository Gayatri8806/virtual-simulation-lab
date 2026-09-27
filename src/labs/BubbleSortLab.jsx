import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV CX, N-1        ; outer loop counter",
  "OUTER: MOV BX, OFFSET ARRAY",
  "MOV DX, CX          ; inner loop counter",
  "INNER: MOV AL, [BX]",
  "CMP AL, [BX+1]",
  "JLE SKIP",
  "XCHG AL, [BX+1]     ; swap",
  "MOV [BX], AL",
  "SKIP: INC BX",
  "DEC DX",
  "JNZ INNER",
  "DEC CX",
  "JNZ OUTER",
  "HLT",
];

const START = [45, 12, 88, 3, 67];

export default function BubbleSortLab({ setPage }) {
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const arr = [...START];
    const trace = [{ line: 0, cx: arr.length - 1, dx: 0, bx: 0, ax: 0, memory: [...arr], note: "start: outer loop count = n-1" }];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        trace.push({ line: 3, cx: arr.length - 1 - i, dx: arr.length - 1 - i, bx: j, ax: arr[j], memory: [...arr], highlight: [j, j + 1], note: `compare index ${j} and ${j + 1}` });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          trace.push({ line: 6, cx: arr.length - 1 - i, dx: arr.length - 1 - i, bx: j, ax: arr[j + 1], memory: [...arr], highlight: [j, j + 1], note: "swapped (out of order)" });
        }
      }
    }
    trace.push({ line: 13, cx: 0, dx: 0, bx: 0, ax: 0, memory: [...arr], note: "sorted, halt" });
    return trace;
  }, []);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 3"
      title="Ascending order sort of an array (bubble sort)"
      aim="Aim: write an 8086 assembly program to sort an array of numbers in ascending order using the bubble sort technique — repeatedly comparing and swapping adjacent elements."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <RegisterPanel step={steps[idx]} />
        <p style={{ fontSize: 11.5, color: INK_SOFT }}>Original array: [{START.join(", ")}]</p>
        <VivaCheck
          question="Why does bubble sort need a nested loop (outer and inner)?"
          options={[["a", "One loop just doesn't compile in assembly"], ["b", "One full inner pass only guarantees the largest remaining element 'bubbles' to its correct position — the outer loop repeats this enough times to sort every element", ], ["c", "The inner loop is only for decoration and doesn't affect sorting"]]}
          correctKey="b"
          explanation="Each inner-loop pass compares adjacent pairs and pushes the largest unsorted value to the end — but that alone only places one element correctly. The outer loop repeats the process n-1 times so every element eventually settles into its sorted position."
        />
      </>}
    />
  );
}
