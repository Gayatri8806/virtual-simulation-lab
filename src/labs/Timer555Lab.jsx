import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";

function astableWave(r1, r2, cUF) {
  const c = cUF * 1e-6;
  const freq = 1.44 / ((r1 + 2 * r2) * c);
  const duty = ((r1 + r2) / (r1 + 2 * r2)) * 100;
  const period = 1 / freq;
  const points = 300;
  const cycles = 3;
  const data = [];
  for (let n = 0; n <= points; n++) {
    const t = (n / points) * cycles * period;
    const phase = (t % period) / period;
    const high = phase < duty / 100;
    data.push({ tMs: Number((t * 1000).toFixed(3)), out: high ? 1 : 0 });
  }
  return { data, freq, duty, period };
}

function monostableWave(r, cUF) {
  const c = cUF * 1e-6;
  const pulseWidth = 1.1 * r * c;
  const totalT = pulseWidth * 2.2;
  const points = 300;
  const data = [];
  for (let n = 0; n <= points; n++) {
    const t = (n / points) * totalT;
    const triggered = t > totalT * 0.08 && t < totalT * 0.08 + Math.min(0.02 * totalT, pulseWidth * 0.05);
    const out = t > totalT * 0.08 && t < totalT * 0.08 + pulseWidth ? 1 : 0;
    data.push({ tMs: Number((t * 1000).toFixed(3)), trigger: triggered ? 1 : 0, out });
  }
  return { data, pulseWidth };
}

export default function Timer555Lab({ setPage }) {
  const [mode, setMode] = useState("astable");
  const [r1, setR1] = useState(4700);
  const [r2, setR2] = useState(2200);
  const [r, setR] = useState(10000);
  const [cUF, setCUF] = useState(0.1);
  const [quizAnswer, setQuizAnswer] = useState(null);

  const astable = useMemo(() => astableWave(r1, r2, cUF), [r1, r2, cUF]);
  const mono = useMemo(() => monostableWave(r, cUF), [r, cUF]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>555 timer &mdash; astable / monostable</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: use R and C to set the free-running frequency (astable mode) or the one-shot pulse width (monostable mode).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Mode</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ flex: 1, background: mode === "astable" ? "#E4EFEC" : "transparent" }} onClick={() => setMode("astable")}>Astable</button>
              <button className="btn-outline" style={{ flex: 1, background: mode === "monostable" ? "#E4EFEC" : "transparent" }} onClick={() => setMode("monostable")}>Monostable</button>
            </div>

            {mode === "astable" ? (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>R1</label>
                <select className="field" style={{ marginTop: 8 }} value={r1} onChange={e => setR1(Number(e.target.value))}>
                  <option value={2200}>2.2 k&Omega;</option>
                  <option value={4700}>4.7 k&Omega;</option>
                  <option value={10000}>10 k&Omega;</option>
                </select>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>R2</label>
                <select className="field" style={{ marginTop: 8 }} value={r2} onChange={e => setR2(Number(e.target.value))}>
                  <option value={2200}>2.2 k&Omega;</option>
                  <option value={4700}>4.7 k&Omega;</option>
                  <option value={10000}>10 k&Omega;</option>
                </select>
              </>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>R</label>
                <select className="field" style={{ marginTop: 8 }} value={r} onChange={e => setR(Number(e.target.value))}>
                  <option value={4700}>4.7 k&Omega;</option>
                  <option value={10000}>10 k&Omega;</option>
                  <option value={47000}>47 k&Omega;</option>
                </select>
              </>
            )}

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>C</label>
            <select className="field" style={{ marginTop: 8 }} value={cUF} onChange={e => setCUF(Number(e.target.value))}>
              <option value={0.01}>0.01 &micro;F</option>
              <option value={0.1}>0.1 &micro;F</option>
              <option value={1}>1 &micro;F</option>
            </select>
          </div>

          <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            {mode === "astable" ? (
              <>
                <Readout label="Frequency" value={`${astable.freq.toFixed(1)} Hz`} />
                <Readout label="Duty cycle" value={`${astable.duty.toFixed(1)} %`} />
              </>
            ) : (
              <Readout label="Pulse width" value={`${(mono.pulseWidth * 1000).toFixed(2)} ms`} />
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{mode === "astable" ? "Output square wave" : "Trigger and output pulse"}</p>
            <div style={{ width: "100%", height: 240 }}>
              <ResponsiveContainer>
                <LineChart data={mode === "astable" ? astable.data : mono.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="tMs" type="number" tick={{ fontSize: 12 }} label={{ value: "time (ms)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis domain={[-0.2, 1.2]} ticks={[0, 1]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  {mode === "astable" ? (
                    <Line type="stepAfter" dataKey="out" name="Output" stroke={TEAL_DARK} strokeWidth={2} dot={false} />
                  ) : (
                    <>
                      <Line type="stepAfter" dataKey="trigger" name="Trigger" stroke={AMBER} strokeWidth={1.5} dot={false} />
                      <Line type="stepAfter" dataKey="out" name="Output" stroke={TEAL_DARK} strokeWidth={2} dot={false} />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>A monostable 555 timer produces:</p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[["a", "A continuous square wave"], ["b", "One pulse per trigger"], ["c", "A sine wave"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - that's the one-shot pulse you see in monostable mode above." : "Not quite - astable mode is the one that free-runs continuously; monostable fires once per trigger."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
