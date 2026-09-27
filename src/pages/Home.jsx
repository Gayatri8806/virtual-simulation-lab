import { PlayCircle, ChevronRight } from "lucide-react";
import { SUBJECTS, INK, INK_SOFT, TEAL_DARK, AMBER } from "../constants";

function MiniScope() {
  const pts = "0,40 15,40 22,10 30,70 38,40 55,40 62,15 70,65 78,40 120,40";
  return (
    <svg width="140" height="80" viewBox="0 0 120 80" style={{ background: INK, borderRadius: 8, flexShrink: 0 }}>
      <polyline points={pts} fill="none" stroke={AMBER} strokeWidth="2" />
      <line x1="0" y1="40" x2="120" y2="40" stroke="#2A4051" strokeWidth="1" />
    </svg>
  );
}

export default function Home({ setPage }) {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "56px 40px" }}>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, letterSpacing: 0.5, marginBottom: 10 }}>1st year engineering &middot; virtual practicals</p>
      <h1 style={{ fontFamily: "Spectral, serif", fontSize: 44, lineHeight: 1.15, margin: "0 0 18px", maxWidth: 640 }}>
        Run the practical. Read the meter. Understand the curve.
      </h1>
      <p style={{ fontSize: 16.5, color: INK_SOFT, maxWidth: 560, lineHeight: 1.65, marginBottom: 30 }}>
        A simulated laboratory bench for every 1st year subject &mdash; physics, chemistry, electrical,
        electronics, mechanics and programming. Set your inputs, watch real circuit and instrument
        behaviour, and record readings exactly like you would on the bench.
      </p>
      <div style={{ display: "flex", gap: 12, marginBottom: 54 }}>
        <button className="btn-primary" onClick={() => setPage("lab-diode")}><PlayCircle size={17} /> Try the diode lab</button>
        <button className="btn-outline" onClick={() => setPage("labs")}>Browse all labs</button>
      </div>

      <div className="card" style={{ display: "flex", gap: 28, alignItems: "center", marginBottom: 40 }}>
        <MiniScope />
        <div>
          <h3 style={{ margin: "0 0 6px", fontFamily: "Spectral, serif", fontSize: 19 }}>Today's featured practical</h3>
          <p style={{ margin: "0 0 10px", color: INK_SOFT, fontSize: 14.5 }}>Basic Electronics Engineering &mdash; PN junction diode V-I characteristics. Vary the source voltage, watch the diode turn on around its knee voltage, and plot your own graph.</p>
          <span onClick={() => setPage("lab-diode")} style={{ color: TEAL_DARK, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>Open lab <ChevronRight size={15} /></span>
        </div>
      </div>

      <h3 style={{ fontFamily: "Spectral, serif", fontSize: 19, marginBottom: 16 }}>Subjects on the bench</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {SUBJECTS.map(s => (
          <div key={s.id} className="card" style={{ padding: 16, cursor: s.ready ? "pointer" : "default", opacity: s.ready ? 1 : 0.6 }}
               onClick={() => s.ready && setPage(s.page)}>
            <s.icon size={19} color={s.ready ? TEAL_DARK : INK_SOFT} />
            <p style={{ margin: "10px 0 2px", fontWeight: 600, fontSize: 14.5 }}>{s.name}</p>
            <p style={{ margin: 0, fontSize: 12.5, color: INK_SOFT }}>{s.count} practicals {s.ready ? `&middot; ${s.readyCount} ready` : "&middot; coming soon"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
