import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV AX, 0000H     ; AX = running sum",
  "MOV BX, OFFSET ARRAY",
  "MOV CX, N",
  "NEXT: ADD AL, [BX]",
  "JNC NOCARRY",
  "INC AH            ; propagate carry into AH",
  "NOCARRY: INC BX",
  "DEC CX",
  "JNZ NEXT",
  "MOV SUM, AX",
  "HLT",
];

const ARRAY = [40, 85, 12, 60, 33];

export default function ArraySumLab({ setPage }) {
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const trace = [{ line: 0, ax: 0, bx: 0, cx: ARRAY.length, dx: 0, memory: [...ARRAY], note: "AX = 0" }];
    let sum = 0;
    for (let i = 0; i < ARRAY.length; i++) {
      sum += ARRAY[i];
      trace.push({ line: 3, ax: sum, bx: i, cx: ARRAY.length - i - 1, dx: 0, memory: [...ARRAY], highlight: [i], cf: sum > 255 && sum - ARRAY[i] <= 255, note: `added index ${i} (${ARRAY[i]}), running sum = ${sum}` });
    }
    trace.push({ line: 10, ax: sum, bx: ARRAY.length, cx: 0, dx: 0, memory: [...ARRAY], note: `SUM = AX = ${sum}` });
    return trace;
  }, []);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 8"
      title="Sum of array elements"
      aim="Aim: write an 8086 assembly program to add up all elements of a byte array, using AL for the running sum and AH to catch any carry when a partial sum exceeds 255."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <RegisterPanel step={steps[idx]} />
        <p style={{ fontSize: 11.5, color: INK_SOFT }}>Array: [{ARRAY.join(", ")}]</p>
        <VivaCheck
          question="Why does this program add into AL (not AX) and separately track carries into AH?"
          options={[["a", "AL and AH can't be used together at all"], ["b", "The array holds 8-bit values, so ADD AL,[BX] adds one byte at a time; since the running total can exceed 255, AH catches each carry-out so the full 16-bit sum ends up correct across AX", ], ["c", "This is unnecessary and AX alone would work identically"]]}
          correctKey="b"
          explanation="ADD AL,[BX] performs 8-bit addition matching the array's byte-sized elements. When that sum overflows past 255, the carry flag signals it, and incrementing AH manually accumulates those overflows — together AX (AH:AL) holds the correct full-width total."
        />
      </>}
    />
  );
}
