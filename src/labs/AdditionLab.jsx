import { useState, useMemo } from "react";
import MPLabShell from "./mp/MPLabShell";
import RegisterTrace, { RegisterPanel } from "./mp/RegisterTrace";
import VivaCheck from "./mp/VivaCheck";
import { INK_SOFT } from "../constants";

const PROGRAM = [
  "MOV AX, 0000H",
  "MOV AX, NUM1",
  "ADD AX, NUM2",
  "JNC STORE",
  "MOV CX, 0001H  ; carry occurred",
  "STORE: MOV RESULT, AX",
  "HLT",
];

export default function AdditionLab({ setPage }) {
  const [num1, setNum1] = useState(45000);
  const [num2, setNum2] = useState(25000);
  const [idx, setIdx] = useState(0);

  const steps = useMemo(() => {
    const sum = num1 + num2;
    const carry = sum > 65535;
    const result = sum & 0xffff;
    return [
      { line: 0, ax: 0, bx: 0, cx: 0, dx: 0, zf: false, cf: false, note: "initialize AX" },
      { line: 1, ax: num1, bx: 0, cx: 0, dx: 0, zf: false, cf: false, note: `load NUM1 (${num1})` },
      { line: 2, ax: result, bx: 0, cx: 0, dx: 0, zf: result === 0, cf: carry, note: `AX = AX + NUM2 = ${result}${carry ? " (carry out)" : ""}` },
      carry
        ? { line: 4, ax: result, bx: 0, cx: 1, dx: 0, zf: result === 0, cf: true, note: "carry flag set, CX = 1" }
        : { line: 5, ax: result, bx: 0, cx: 0, dx: 0, zf: result === 0, cf: false, note: "no carry, skip to STORE" },
      { line: 5, ax: result, bx: 0, cx: carry ? 1 : 0, dx: 0, zf: result === 0, cf: carry, note: `RESULT = AX = ${result}` },
      { line: 6, ax: result, bx: 0, cx: carry ? 1 : 0, dx: 0, zf: result === 0, cf: carry, note: "halt" },
    ];
  }, [num1, num2]);

  return (
    <MPLabShell
      setPage={setPage}
      unit="ALP 1"
      title="Addition of two 16-bit numbers (with carry)"
      aim="Aim: write an 8086 assembly program to add two 16-bit numbers, and detect if the result overflows into a carry using the carry flag (CF)."
      controls={<>
        <RegisterTrace program={PROGRAM} steps={steps} idx={idx} setIdx={setIdx} />
      </>}
      results={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>NUM1</label>
          <input className="field" style={{ marginTop: 6 }} type="number" max="65535" value={num1} onChange={e => { setNum1(Number(e.target.value)); setIdx(0); }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 10 }}>NUM2</label>
          <input className="field" style={{ marginTop: 6 }} type="number" max="65535" value={num2} onChange={e => { setNum2(Number(e.target.value)); setIdx(0); }} />
          <p style={{ fontSize: 11.5, color: INK_SOFT, marginTop: 8 }}>Try values that sum past 65535 to see the carry flag trigger.</p>
        </div>
        <RegisterPanel step={steps[idx]} />
        <VivaCheck
          question="The carry flag (CF) gets set when:"
          options={[["a", "The result of an arithmetic operation is exactly zero"], ["b", "An unsigned arithmetic operation produces a result that doesn't fit in the register — a carry out of the most significant bit", ], ["c", "Any MOV instruction executes"]]}
          correctKey="b"
          explanation="CF specifically tracks overflow in unsigned arithmetic — if adding two 16-bit numbers produces a result requiring a 17th bit, that overflow bit becomes CF, exactly what JNC (jump if no carry) checks in this program."
        />
      </>}
    />
  );
}
