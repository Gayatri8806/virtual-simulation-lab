import { useState, useMemo } from "react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

// 4-variable K-map, gray-code ordered
const ROWS = [0, 1, 3, 2]; // AB gray order
const COLS = [0, 1, 3, 2]; // CD gray order

function minterm(ab, cd) {
  // combine AB (2 bits) and CD (2 bits) into a 4-bit minterm index
  return (ab << 2) | cd;
}

export default function KMapLab({ setPage }) {
  const [selected, setSelected] = useState(new Set([0, 1, 4, 5, 12, 13]));

  const toggle = (m) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m); else next.add(m);
      return next;
    });
  };

  const sop = useMemo(() => {
    if (selected.size === 0) return "0";
    const terms = [...selected].sort((a, b) => a - b).map(m => {
      const bits = m.toString(2).padStart(4, "0");
      const vars = ["A", "B", "C", "D"];
      return bits.split("").map((b, i) => b === "1" ? vars[i] : `${vars[i]}'`).join("");
    });
    return terms.join(" + ");
  }, [selected]);

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit I"
      title="Boolean minimization using a 4-variable Karnaugh map"
      aim="Aim: click cells on a 4-variable K-map to mark minterms of a Boolean function, and read off the resulting sum-of-products expression as you build it up."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>K-map (click cells to toggle 1/0)</p>
          <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
            <thead>
              <tr>
                <th></th>
                {["00", "01", "11", "10"].map(cd => <th key={cd} className="mono" style={{ color: INK_SOFT, fontSize: 11, padding: 4 }}>CD={cd}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((ab, ri) => (
                <tr key={ab}>
                  <td className="mono" style={{ color: INK_SOFT, fontSize: 11, padding: 4 }}>AB={ab.toString(2).padStart(2, "0")}</td>
                  {COLS.map((cd, ci) => {
                    const m = minterm(ab, cd);
                    const on = selected.has(m);
                    return (
                      <td key={ci} onClick={() => toggle(m)} style={{
                        width: 44, height: 44, textAlign: "center", cursor: "pointer",
                        background: on ? AMBER : "#0F1D27", color: on ? "#0F1D27" : "#5C7686",
                        border: "1px solid #2A3B47", fontFamily: "monospace", fontWeight: 600, fontSize: 13,
                      }}>
                        {on ? 1 : 0}
                        <div style={{ fontSize: 8, color: on ? "#3A2A0A" : "#3E4E5A" }}>m{m}</div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Sum-of-products (unminimized, from marked minterms)</p>
          <div className="mono" style={{ background: "#0F1D27", color: AMBER, padding: "12px 14px", borderRadius: 8, fontSize: 13, wordBreak: "break-word" }}>
            F(A,B,C,D) = {sop}
          </div>
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Try grouping adjacent 1s into rectangles of 2, 4, or 8 cells by eye — each valid group simplifies to a shorter term than listing every individual minterm.</p>
        </div>
        <VivaCheck
          question="In a K-map, why are adjacent cells arranged in Gray code order (00, 01, 11, 10) instead of normal binary order (00, 01, 10, 11)?"
          options={[["a", "It's purely a historical convention with no functional benefit"], ["b", "Gray code ensures that any two physically adjacent cells differ by exactly one variable, which is exactly what makes grouping adjacent 1s produce a valid simplification", ], ["c", "It makes the table look more symmetric"]]}
          correctKey="b"
          explanation="K-map simplification relies on combining adjacent cells that differ in only one variable (so that variable cancels out). Gray code ordering guarantees every physically neighboring cell meets that one-bit-difference condition — normal binary order would break this adjacency property."
        />
      </>}
    />
  );
}
