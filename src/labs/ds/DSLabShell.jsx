import { INK_SOFT, TEAL_DARK } from "../../constants";

export default function DSLabShell({ setPage, group, title, aim, controls, results }) {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-datastructures")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to data structures labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>data structures laboratory &middot; {group}</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>{title}</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 680, marginBottom: 30 }}>{aim}</p>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{controls}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{results}</div>
      </div>
    </div>
  );
}
