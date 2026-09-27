import { SUBJECTS, INK_SOFT, TEAL_DARK } from "../constants";

export default function About() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 40px" }}>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 32, marginBottom: 16 }}>About this project</h2>
      <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.7, marginBottom: 18 }}>
        Virtual Engineering Labs gives 1st year engineering students a way to perform core
        practicals from a browser &mdash; before or instead of the physical lab session. Every
        practical mirrors a real bench: you choose inputs, the simulation applies the underlying
        physics or circuit equations, and you record readings into a results table just as you
        would on paper.
      </p>
      <p style={{ fontSize: 15.5, color: INK_SOFT, lineHeight: 1.7, marginBottom: 30 }}>
        The goal is repeatable, mistake-tolerant practice: run a practical as many times as you
        need, change one variable at a time, and build intuition for how voltage, current,
        resistance and force actually relate &mdash; not just what the lab manual says they should.
      </p>
      <h3 style={{ fontFamily: "Spectral, serif", fontSize: 19, marginBottom: 12 }}>Roadmap</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SUBJECTS.map(s => (
          <div key={s.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
            <span style={{ fontWeight: 600, fontSize: 14.5 }}>{s.name}</span>
            <span className="mono" style={{ fontSize: 12.5, color: s.ready ? TEAL_DARK : INK_SOFT }}>{s.ready ? "1 practical live" : "in progress"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
