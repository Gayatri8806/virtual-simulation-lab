import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV SI, OFFSET STR",
  "MOV DI, OFFSET STR+LEN-1",
  "MOV CX, LEN/2",
  "MOV DX, 1             ; DX = 1 means palindrome so far",
  "NEXT: MOV AL, [SI]",
  "CMP AL, [DI]",
  "JE MATCH",
  "MOV DX, 0             ; mismatch found",
  "JMP DONE",
  "MATCH: INC SI",
  "DEC DI",
  "DEC CX",
  "JNZ NEXT",
  "DONE: HLT",
];

export default function PalindromeLab({ setPage }) {
  const [str, setStr] = useState("MALAYALAM");
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const arr = str.toUpperCase().split("");
    const trace = [{ line: 0, ax: 0, bx: 0, cx: Math.floor(arr.length / 2), dx: 1, memory: [...arr], note: "SI at start, DI at end, DX=1 (assume palindrome)" }];
    let si = 0, di = arr.length - 1, isPalin = true;
    for (let k = 0; k < Math.floor(arr.length / 2); k++) {
      if (arr[si] === arr[di]) {
        trace.push({ line: 6, ax: arr.charCodeAt ? 0 : arr[si].charCodeAt(0), bx: si, cx: Math.floor(arr.length / 2) - k - 1, dx: 1, memory: [...arr], highlight: [si, di], note: `${arr[si]} == ${arr[di]}, continue` });
      } else {
        isPalin = false;
        trace.push({ line: 7, ax: arr[si].charCodeAt(0), bx: si, cx: Math.floor(arr.length / 2) - k - 1, dx: 0, memory: [...arr], highlight: [si, di], note: `${arr[si]} != ${arr[di]}, mismatch — DX=0` });
        break;
      }
      si++; di--;
    }
    trace.push({ line: 12, ax: 0, bx: si, cx: 0, dx: isPalin ? 1 : 0, memory: [...arr], note: `result: ${isPalin ? "palindrome (DX=1)" : "not a palindrome (DX=0)"}` });
    return trace;
  }, [str]);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 6"
      title="Check whether a string is a palindrome"
      aim="Aim: write an 8086 assembly program that compares characters from both ends of a string moving inward, setting a flag register to indicate whether the string reads the same forwards and backwards."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>String</label>
          <input className="field" style={{ marginTop: 6 }} value={str} onChange={e => { setStr(e.target.value); setIdx(0); }} />
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 8 }}>Try "MALAYALAM" (palindrome) or "COMPUTER" (not).</p>
        </div>
        <RegisterPanel step={steps[idx]} />
        <VivaCheck
          question="Why does the loop exit as soon as one mismatch is found, instead of checking every remaining pair?"
          options={[["a", "8086 assembly can't continue a loop after a comparison"], ["b", "A single mismatched pair is enough to prove the string isn't a palindrome — there's no need to keep comparing, so exiting early saves cycles", ], ["c", "It's a bug in the program"]]}
          correctKey="b"
          explanation="Once any pair of characters fails to match, the string is definitively not a palindrome — continuing to check the rest wouldn't change that conclusion, so an early exit (short-circuiting) is both correct and more efficient."
        />
      </>}
    />
  );
}
