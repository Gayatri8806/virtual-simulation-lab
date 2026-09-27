import { ChevronLeft, RotateCcw } from "lucide-react";
import { INK_SOFT, AMBER, TEAL_DARK } from "../../constants";

export default function RegisterTrace({ program, steps, idx, setIdx }) {
  const step = steps[idx];
  const reset = () => setIdx(0);
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(steps.length - 1, i + 1));

  return (
    <>
      <div className="card">
        <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Assembly program</p>
        <div className="mono" style={{ fontSize: 12.5, background: "#0F1D27", borderRadius: 8, padding: "12px 14px" }}>
          {program.map((line, i) => (
            <div key={i} style={{ padding: "2px 6px", borderRadius: 4, background: i === step.line ? "#2E3F4E" : "transparent", color: i === step.line ? AMBER : "#B8C2C8" }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
          <button className="btn-outline" onClick={prev} disabled={idx === 0}><ChevronLeft size={15} /></button>
          <button className="btn-primary" onClick={next} disabled={idx === steps.length - 1} style={{ flex: 1, justifyContent: "center" }}>Step</button>
          <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Step {idx + 1} of {steps.length}{step.note ? ` — ${step.note}` : ""}</p>
      </div>

      {step.memory && (
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Memory / array</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {step.memory.map((val, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div className="mono" style={{ background: "#0F1D27", border: `1.5px solid ${step.highlight?.includes(i) ? AMBER : TEAL_DARK}`, borderRadius: 6, padding: "6px 9px", fontSize: 13, color: step.highlight?.includes(i) ? AMBER : "#E4EFEC", minWidth: 30 }}>{val}</div>
                <div className="mono" style={{ fontSize: 9, color: INK_SOFT, marginTop: 2 }}>{i}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export function RegisterPanel({ step }) {
  const regs = [["AX", step.ax], ["BX", step.bx], ["CX", step.cx], ["DX", step.dx]];
  return (
    <div className="card">
      <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Registers</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {regs.map(([name, val]) => (
          <div key={name} style={{ textAlign: "center", background: "#0F1D27", borderRadius: 6, padding: "8px 4px" }}>
            <p style={{ fontSize: 11, color: INK_SOFT, margin: "0 0 2px" }}>{name}</p>
            <p className="mono" style={{ fontSize: 15, color: AMBER, margin: 0, fontWeight: 600 }}>{val ?? 0}</p>
          </div>
        ))}
      </div>
      <p style={{ fontWeight: 600, fontSize: 13, marginTop: 14, marginBottom: 8 }}>Flags</p>
      <div style={{ display: "flex", gap: 8 }}>
        <FlagBadge name="ZF" active={step.zf} />
        <FlagBadge name="CF" active={step.cf} />
        <FlagBadge name="SF" active={step.sf} />
      </div>
    </div>
  );
}

function FlagBadge({ name, active }) {
  return (
    <div style={{ flex: 1, textAlign: "center", background: active ? "#2E3F4E" : "#0F1D27", borderRadius: 6, padding: "6px 4px" }}>
      <p className="mono" style={{ fontSize: 12, color: active ? "#D9891F" : "#5C7686", margin: 0, fontWeight: 600 }}>{name}={active ? 1 : 0}</p>
    </div>
  );
}
