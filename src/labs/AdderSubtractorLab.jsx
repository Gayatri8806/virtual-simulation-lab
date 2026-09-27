import { useState } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function AdderSubtractorLab({ setPage }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [cin, setCin] = useState(0);
  const [mode, setMode] = useState("full-adder");

  let sum, carryOrBorrow, label2;
  if (mode === "half-adder") {
    sum = a ^ b;
    carryOrBorrow = a & b;
    label2 = "Carry";
  } else if (mode === "full-adder") {
    sum = a ^ b ^ cin;
    carryOrBorrow = (a & b) | (b & cin) | (a & cin);
    label2 = "Carry-out";
  } else {
    sum = a ^ b ^ cin; // difference, same XOR structure
    carryOrBorrow = (~a & b) | (~a & cin) | (b & cin);
    carryOrBorrow &= 1;
    label2 = "Borrow-out";
  }

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit III"
      title="Half adder, full adder, and full subtractor"
      aim="Aim: build the truth table for a half adder, full adder, and full subtractor by toggling inputs, and observe how each circuit's output logic differs."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Circuit</label>
          <select className="field" style={{ marginTop: 6 }} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="half-adder">Half adder</option>
            <option value="full-adder">Full adder</option>
            <option value="full-subtractor">Full subtractor</option>
          </select>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <ToggleBit label="A" value={a} onToggle={() => setA(1 - a)} />
            <ToggleBit label="B" value={b} onToggle={() => setB(1 - b)} />
            {mode !== "half-adder" && <ToggleBit label={mode === "full-adder" ? "Cin" : "Bin"} value={cin} onToggle={() => setCin(1 - cin)} />}
          </div>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label={mode === "full-subtractor" ? "Difference" : "Sum"} value={sum} />
          <Readout label={label2} value={carryOrBorrow} />
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Logic expression</p>
          <p className="mono" style={{ fontSize: 12.5, color: INK_SOFT }}>
            {mode === "half-adder" && "Sum = A ⊕ B, Carry = A · B"}
            {mode === "full-adder" && "Sum = A ⊕ B ⊕ Cin, Cout = AB + BCin + ACin"}
            {mode === "full-subtractor" && "Diff = A ⊕ B ⊕ Bin, Bout = A'B + A'Bin + BBin"}
          </p>
        </div>
        <VivaCheck
          question="Why does a full adder need a third input (Cin) that a half adder doesn't?"
          options={[["a", "It's an arbitrary design choice"], ["b", "A full adder is meant to be chained together to add multi-bit numbers, so it must accept the carry-out from the previous, less-significant bit's addition", ], ["c", "Cin is only used for testing purposes"]]}
          correctKey="b"
          explanation="When adding multi-bit numbers, each bit position's addition can produce a carry that must be added into the next position. The full adder's Cin input is exactly what lets you chain multiple adders together into a ripple-carry adder for wider numbers."
        />
      </>}
    />
  );
}

function ToggleBit({ label, value, onToggle }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 6px" }}>{label}</p>
      <button onClick={onToggle} className="mono" style={{
        width: 44, height: 44, borderRadius: 8, border: `1.5px solid ${TEAL_DARK}`,
        background: value ? AMBER : "#0F1D27", color: value ? "#0F1D27" : "#5C7686",
        fontSize: 16, fontWeight: 700, cursor: "pointer",
      }}>{value}</button>
    </div>
  );
}

function Readout({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: "#42566A", margin: "0 0 4px" }}>{label}</p>
      <p className="mono" style={{ fontSize: 20, fontWeight: 600, color: AMBER, margin: 0 }}>{value}</p>
    </div>
  );
}
