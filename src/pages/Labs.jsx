import { ChevronRight } from "lucide-react";
import { SUBJECTS, SE_SUBJECTS, INK_SOFT, TEAL_DARK } from "../constants";

function SubjectGrid({ subjects, setPage }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
      {subjects.map(s => (
        <div key={s.id} className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <s.icon size={20} color={TEAL_DARK} />
            {s.ready && <span style={{ fontSize: 11, background: "#E4EFEC", color: TEAL_DARK, padding: "3px 9px", borderRadius: 20, fontWeight: 600 }}>{s.readyCount} ready</span>}
          </div>
          <p style={{ fontWeight: 600, fontSize: 15.5, margin: 0 }}>{s.name}</p>
          <p style={{ fontSize: 13, color: INK_SOFT, margin: 0 }}>{s.count} practicals in the manual</p>
          {s.ready ? (
            <span onClick={() => setPage(s.page)} style={{ color: TEAL_DARK, fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}>
              View all {s.count} practicals <ChevronRight size={14} />
            </span>
          ) : (
            <span style={{ fontSize: 13, color: "#9A9484" }}>Coming soon</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Labs({ setPage, user }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "56px 40px" }}>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, marginBottom: 6 }}>Practical labs</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, marginBottom: 30 }}>{user ? `Signed in as ${user.name}.` : "Sign in to save your readings across sessions."}</p>

      <h3 style={{ fontFamily: "Spectral, serif", fontSize: 19, marginBottom: 14 }}>First Year Engineering</h3>
      <SubjectGrid subjects={SUBJECTS} setPage={setPage} />

      <h3 style={{ fontFamily: "Spectral, serif", fontSize: 19, margin: "36px 0 14px" }}>Second Year &mdash; Computer Engineering</h3>
      <SubjectGrid subjects={SE_SUBJECTS} setPage={setPage} />
    </div>
  );
}
