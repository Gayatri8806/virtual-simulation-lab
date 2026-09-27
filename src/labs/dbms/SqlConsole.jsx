import { AMBER } from "../../constants";

export default function SqlConsole({ log, title = "SQL console" }) {
  return (
    <div className="card">
      <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{title}</p>
      <div className="mono" style={{ background: "#0F1D27", borderRadius: 8, padding: "14px 16px", fontSize: 13, maxHeight: 380, overflowY: "auto" }}>
        {log.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <div style={{ color: "#7C93A3", whiteSpace: "pre-wrap" }}>SQL&gt; {entry.code}</div>
            {entry.table && <DataTable rows={entry.table} />}
            {entry.text && <div style={{ color: entry.isError ? "#E08A7D" : AMBER, whiteSpace: "pre-wrap" }}>{entry.text}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ rows }) {
  if (!rows || rows.length === 0) return <div style={{ color: "#7C93A3" }}>(0 rows)</div>;
  const cols = Object.keys(rows[0]);
  return (
    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", marginTop: 4 }}>
      <thead>
        <tr style={{ color: "#7C93A3" }}>{cols.map(c => <th key={c} style={{ textAlign: "left", padding: "2px 8px", borderBottom: "1px solid #2A3B47" }}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{cols.map(c => <td key={c} style={{ padding: "2px 8px", color: "#D9891F" }}>{String(r[c])}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}
