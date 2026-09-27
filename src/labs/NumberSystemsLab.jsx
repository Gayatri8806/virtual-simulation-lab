import { useState } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

function toBinary(n) { return n.toString(2); }
function toOctal(n) { return n.toString(8); }
function toHex(n) { return n.toString(16).toUpperCase(); }
function toGray(n) { return (n ^ (n >> 1)).toString(2); }
function toBCD(n) {
  return String(n).split("").map(d => Number(d).toString(2).padStart(4, "0")).join(" ");
}

export default function NumberSystemsLab({ setPage }) {
  const [decimal, setDecimal] = useState(45);

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit I"
      title="Number system and code conversions"
      aim="Aim: convert a decimal number into binary, octal, hexadecimal, Gray code, and BCD, and observe how each representation encodes the same value differently."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Decimal value <span className="mono" style={{ color: AMBER }}>{decimal}</span>
          </label>
          <input type="range" min="0" max="255" value={decimal} onChange={e => setDecimal(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <input className="field" style={{ marginTop: 10 }} type="number" min="0" max="255" value={decimal} onChange={e => setDecimal(Math.max(0, Math.min(255, Number(e.target.value))))} />
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["Binary", toBinary(decimal)],
            ["Octal", toOctal(decimal)],
            ["Hexadecimal", toHex(decimal)],
            ["Gray code", toGray(decimal)],
            ["BCD (per digit)", toBCD(decimal)],
          ].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F1D27", borderRadius: 6, padding: "8px 12px" }}>
              <span style={{ fontSize: 12.5, color: INK_SOFT }}>{label}</span>
              <span className="mono" style={{ fontSize: 15, color: AMBER, fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
        <VivaCheck
          question="Why is Gray code useful in circuits like rotary encoders, where binary isn't?"
          options={[["a", "Gray code numbers are always shorter than binary"], ["b", "Only one bit changes between any two consecutive Gray code values, avoiding the momentary false states that can occur when multiple binary bits change at once", ], ["c", "Gray code can represent negative numbers directly"]]}
          correctKey="b"
          explanation="Going from binary 3 (011) to 4 (100) flips three bits simultaneously — in real hardware these don't switch at exactly the same instant, risking a brief incorrect reading. Gray code changes exactly one bit per step, eliminating that glitch entirely."
        />
      </>}
    />
  );
}
