import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV AL, NUM1",
  "MOV BL, NUM2",
  "MUL BL          ; AX = AL * BL",
  "MOV RESULT, AX",
  "HLT",
];

export default function MultiplicationLab({ setPage }) {
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(15);
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const product = num1 * num2;
    return [
      { line: 0, ax: num1, bx: 0, cx: 0, dx: 0, zf: false, cf: false, note: `AL = NUM1 (${num1})` },
      { line: 1, ax: num1, bx: num2, cx: 0, dx: 0, zf: false, cf: false, note: `BL = NUM2 (${num2})` },
      { line: 2, ax: product, bx: num2, cx: 0, dx: 0, zf: product === 0, cf: product > 255, note: `AX = AL * BL = ${product}${product > 255 ? " (result needs 16 bits, CF set)" : ""}` },
      { line: 3, ax: product, bx: num2, cx: 0, dx: 0, zf: product === 0, cf: product > 255, note: `RESULT = AX = ${product}` },
      { line: 4, ax: product, bx: num2, cx: 0, dx: 0, zf: product === 0, cf: product > 255, note: "halt" },
    ];
  }, [num1, num2]);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 2"
      title="Multiplication of two 8-bit numbers"
      aim="Aim: write an 8086 assembly program using the MUL instruction to multiply two 8-bit numbers, producing a 16-bit result in AX."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>NUM1 (8-bit)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" max="255" value={num1} onChange={e => { setNum1(Number(e.target.value)); setIdx(0); }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 10 }}>NUM2 (8-bit)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" max="255" value={num2} onChange={e => { setNum2(Number(e.target.value)); setIdx(0); }} />
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 8 }}>Try two values whose product exceeds 255 to see CF set.</p>
        </div>
        <RegisterPanel step={steps[idx]} />
        <VivaCheck
          question="Why does MUL BL store its result across the full AX register instead of just AL?"
          options={[["a", "It's an arbitrary design choice with no reason"], ["b", "Multiplying two 8-bit numbers can produce a result up to 16 bits wide (255×255=65025), which no longer fits in the 8-bit AL alone", ], ["c", "AX is always used for every instruction regardless of operand size"]]}
          correctKey="b"
          explanation="The maximum product of two 8-bit numbers (255 × 255 = 65,025) needs up to 16 bits to represent — more than AL's 8 bits can hold — so the 8086 places the full result in AX (with AH holding the overflow byte)."
        />
      </>}
    />
  );
}
