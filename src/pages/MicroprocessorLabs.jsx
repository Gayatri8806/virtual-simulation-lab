import { ChevronRight, Lock, CircuitBoard } from "lucide-react";
import { MP_LABS, INK_SOFT, TEAL_DARK } from "../constants";

export default function MicroprocessorLabs({ setPage }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 40px" }}>
      <span onClick={() => setPage("labs")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to all subjects</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0 6px" }}>
        <CircuitBoard size={22} color={TEAL_DARK} />
        <h2 style={{ fontFamily: "Spectral, serif", fontSize: 28, margin: 0 }}>Microprocessor Laboratory</h2>
      </div>
      <p style={{ color: INK_SOFT, fontSize: 14.5, marginBottom: 8 }}>
        SPPU 2024 Pattern, PCC-255-COM &mdash; Second Year Computer Engineering, Semester IV.
      </p>
      <p style={{ color: INK_SOFT, fontSize: 13, marginBottom: 28 }}>
        8086 assembly language programming — step through each program instruction by instruction and watch the registers, flags, and memory change live.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MP_LABS.map((lab, idx) => (
          <div
            key={lab.id}
            className="card"
            style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 18px", cursor: lab.ready ? "pointer" : "default", opacity: lab.ready ? 1 : 0.6 }}
            onClick={() => lab.ready && setPage(lab.id)}
          >
            <span className="mono" style={{ color: TEAL_DARK, fontSize: 13, width: 20 }}>{idx + 1}</span>
            <div style={{ flex: 1 }}>
              <p className="mono" style={{ fontSize: 11, color: INK_SOFT, margin: "0 0 3px" }}>{lab.unit}</p>
              <p style={{ fontWeight: 600, fontSize: 14.5, margin: 0 }}>{lab.title}</p>
              {lab.blurb && <p style={{ fontSize: 13, color: INK_SOFT, margin: "3px 0 0" }}>{lab.blurb}</p>}
            </div>
            {lab.ready ? <ChevronRight size={16} color={TEAL_DARK} /> : <Lock size={14} color="#9A9484" />}
          </div>
        ))}
      </div>
    </div>
  );
}
