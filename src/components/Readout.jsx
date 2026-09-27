import { INK_SOFT, AMBER } from "../constants";

export default function Readout({ label, value }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: 12, color: INK_SOFT, margin: "0 0 4px" }}>{label}</p>
      <p className="mono" style={{ fontSize: 20, fontWeight: 600, color: AMBER, margin: 0 }}>{value}</p>
    </div>
  );
}
