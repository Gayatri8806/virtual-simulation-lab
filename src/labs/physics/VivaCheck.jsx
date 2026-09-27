import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { TEAL_DARK } from "../../constants";

export default function VivaCheck({ question, options, correctKey, explanation }) {
  const [answer, setAnswer] = useState(null);
  const correct = answer === correctKey;
  return (
    <div className="card">
      <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
      <p style={{ fontSize: 14, marginBottom: 10 }}>{question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
        {options.map(([key, label]) => (
          <button
            key={key}
            className="btn-outline"
            style={{
              textAlign: "left",
              borderColor: answer === key ? (correct && key === correctKey ? TEAL_DARK : "#B23A2E") : "#C9C2AE",
              color: answer === key ? (correct && key === correctKey ? TEAL_DARK : "#B23A2E") : undefined,
            }}
            onClick={() => setAnswer(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {answer && (
        <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "flex-start", gap: 6, color: correct ? TEAL_DARK : "#B23A2E" }}>
          {correct ? <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} /> : <XCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
          <span>{correct ? "Correct. " : "Not quite. "}{explanation}</span>
        </p>
      )}
    </div>
  );
}
