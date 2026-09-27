import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV SI, OFFSET STR    ; SI -> start",
  "MOV DI, OFFSET STR+LEN-1  ; DI -> end",
  "MOV CX, LEN/2",
  "NEXT: MOV AL, [SI]",
  "MOV AH, [DI]",
  "MOV [SI], AH          ; swap",
  "MOV [DI], AL",
  "INC SI",
  "DEC DI",
  "DEC CX",
  "JNZ NEXT",
  "HLT",
];

const STR = "COMPUTER".split("");

export default function StringReverseLab({ setPage }) {
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const arr = [...STR];
    const trace = [{ line: 0, ax: 0, bx: 0, cx: Math.floor(arr.length / 2), dx: 0, memory: [...arr], note: "SI at start, DI at end" }];
    let si = 0, di = arr.length - 1;
    for (let k = 0; k < Math.floor(arr.length / 2); k++) {
      [arr[si], arr[di]] = [arr[di], arr[si]];
      trace.push({ line: 6, ax: 0, bx: si, cx: Math.floor(arr.length / 2) - k - 1, dx: di, memory: [...arr], highlight: [si, di], note: `swapped positions ${si} and ${di}` });
      si++; di--;
    }
    trace.push({ line: 11, ax: 0, bx: si, cx: 0, dx: di, memory: [...arr], note: `reversed: "${arr.join("")}"` });
    return trace;
  }, []);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 5"
      title="Reverse a string"
      aim="Aim: write an 8086 assembly program to reverse a string in place, using two index registers (SI, DI) starting from opposite ends and swapping inward."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <RegisterPanel step={steps[idx]} />
        <p style={{ fontSize: 11.5, color: INK_SOFT }}>Original string: "{STR.join("")}"</p>
        <VivaCheck
          question="Why does the loop run LEN/2 times rather than LEN times?"
          options={[["a", "It's a rounding convenience with no real reason"], ["b", "Each swap exchanges two characters at once, so processing half the length covers the whole string — looping the full length would swap everything back to the original", ], ["c", "8086 registers can't count past LEN/2"]]}
          correctKey="b"
          explanation="Each iteration swaps a pair of characters (one from the front, one from the back). Since each swap handles 2 characters, only LEN/2 iterations are needed to cover the entire string — continuing further would simply undo the swaps."
        />
      </>}
    />
  );
}
