import { ChevronRight } from "lucide-react";
import { ELECTRONICS_LABS, INK_SOFT, TEAL_DARK } from "../constants";

export default function ElectronicsLabs({ setPage }) {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "56px 40px" }}>
      <span onClick={() => setPage("labs")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; All subjects</span>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "14px 0 6px" }}>Basic Electronics Engineering</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, marginBottom: 28 }}>All 7 practicals from the 1st year manual, ready to run.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ELECTRONICS_LABS.map((lab, idx) => (
          <div key={lab.id} className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }} onClick={() => setPage(lab.id)}>
            <span className="mono" style={{ color: TEAL_DARK, fontSize: 13, width: 20 }}>{idx + 1}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 15, margin: 0 }}>{lab.title}</p>
              <p style={{ fontSize: 13, color: INK_SOFT, margin: "2px 0 0" }}>{lab.blurb}</p>
            </div>
            <ChevronRight size={16} color={INK_SOFT} />
          </div>
        ))}
      </div>
    </div>
  );
}
