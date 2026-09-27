import { AMBER } from "../../constants";

export default function PyShell({ log, title = "Python shell" }) {
  return (
    <div className="card">
      <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{title}</p>
      <div className="mono" style={{ background: "#0F1D27", borderRadius: 8, padding: "14px 16px", fontSize: 13, maxHeight: 340, overflowY: "auto" }}>
        {log.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: 8, whiteSpace: "pre-wrap" }}>
            <div style={{ color: "#7C93A3" }}>&gt;&gt;&gt; {entry.code}</div>
            {entry.out !== null && entry.out !== undefined && (
              <div style={{ color: entry.isError ? "#E08A7D" : AMBER }}>{entry.out}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
