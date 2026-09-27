import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV SI, OFFSET SOURCE",
  "MOV DI, OFFSET DEST",
  "MOV CX, N",
  "NEXT: MOV AL, [SI]",
  "MOV [DI], AL",
  "INC SI",
  "INC DI",
  "DEC CX",
  "JNZ NEXT",
  "HLT",
];

const SOURCE = [11, 22, 33, 44, 55, 66];

export default function BlockTransferLab({ setPage }) {
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const dest = Array(SOURCE.length).fill(0);
    const trace = [{ line: 0, ax: 0, bx: 0, cx: SOURCE.length, dx: 0, memory: [...SOURCE, ...dest], note: "SI -> SOURCE, DI -> DEST (right half)" }];
    for (let i = 0; i < SOURCE.length; i++) {
      dest[i] = SOURCE[i];
      trace.push({
        line: 4, ax: SOURCE[i], bx: i, cx: SOURCE.length - i - 1, dx: i,
        memory: [...SOURCE, ...dest],
        highlight: [i, SOURCE.length + i],
        note: `copied byte ${i}: ${SOURCE[i]}`,
      });
    }
    trace.push({ line: 9, ax: 0, bx: SOURCE.length, cx: 0, dx: SOURCE.length, memory: [...SOURCE, ...dest], note: "block transfer complete" });
    return trace;
  }, []);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 7"
      title="Block transfer of data (memory to memory)"
      aim="Aim: write an 8086 assembly program to copy a block of data byte-by-byte from a source memory location to a destination location, using SI and DI as source and destination pointers."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <RegisterPanel step={steps[idx]} />
        <p style={{ fontSize: 11.5, color: INK_SOFT }}>Left half of memory = SOURCE, right half = DEST (starts all zero).</p>
        <VivaCheck
          question="Why does this program use two separate index registers (SI and DI) instead of one?"
          options={[["a", "8086 requires exactly two registers for any loop"], ["b", "SOURCE and DEST are two different memory locations, so the program needs to track a read position (SI) and a write position (DI) independently", ], ["c", "It's purely a style convention with no functional purpose"]]}
          correctKey="b"
          explanation="Since source and destination are separate memory blocks, the program needs to advance through each independently — SI tracks where to read from next, DI tracks where to write to next. A single register couldn't serve both roles simultaneously."
        />
      </>}
    />
  );
}
