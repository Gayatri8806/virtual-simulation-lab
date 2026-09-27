import { INK_SOFT, TEAL_DARK } from "../../constants";

export default function ChemLabShell({ setPage, unit, title, aim, procedure, controls, results }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-chemistry")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to chemistry labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>engineering chemistry &middot; {unit}</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>{title}</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 660, marginBottom: procedure ? 12 : 30 }}>{aim}</p>
      {procedure && (
        <ol style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.8, maxWidth: 660, marginBottom: 30, paddingLeft: 20 }}>
          {procedure.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{controls}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{results}</div>
      </div>
    </div>
  );
}
