import { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";

const RAIL = 12;
const FREQ = 50;

function simulate(mode, rin, rf, vin) {
  const gain = mode === "inverting" ? -(rf / rin) : 1 + rf / rin;
  const points = 200;
  const T = 1 / FREQ;
  const data = [];
  for (let n = 0; n <= points; n++) {
    const t = (n / points) * T;
    const vinT = vin * Math.sin(2 * Math.PI * FREQ * t);
    let voutT = gain * vinT;
    voutT = Math.max(-RAIL, Math.min(RAIL, voutT));
    data.push({ tMs: Number((t * 1000).toFixed(2)), vin: Number(vinT.toFixed(2)), vout: Number(voutT.toFixed(2)) });
  }
  return { data, gain };
}

export default function OpAmpLab({ setPage }) {
  const [mode, setMode] = useState("inverting");
  const [rin, setRin] = useState(1000);
  const [rf, setRf] = useState(10000);
  const [vin, setVin] = useState(1);
  const [readings, setReadings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const idRef = useRef(1);

  const { data, gain } = useMemo(() => simulate(mode, rin, rf, vin), [mode, rin, rf, vin]);
  const theoreticalPeak = Math.abs(gain) * vin;
  const measuredPeak = Math.max(...data.map(d => Math.abs(d.vout)));
  const clipped = theoreticalPeak > RAIL;

  const record = () => {
    setReadings(prev => [...prev, { id: idRef.current++, mode, rin, rf, gain: Number(gain.toFixed(2)), vout: Number(measuredPeak.toFixed(2)) }]);
  };
  const reset = () => setReadings([]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>Op-amp amplifier</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: verify the gain formula for inverting and non-inverting configurations, and observe saturation at the supply rails.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Configuration</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ flex: 1, background: mode === "inverting" ? "#E4EFEC" : "transparent" }} onClick={() => setMode("inverting")}>Inverting</button>
              <button className="btn-outline" style={{ flex: 1, background: mode === "non-inverting" ? "#E4EFEC" : "transparent" }} onClick={() => setMode("non-inverting")}>Non-inverting</button>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Rin</label>
            <select className="field" style={{ marginTop: 8 }} value={rin} onChange={e => setRin(Number(e.target.value))}>
              <option value={1000}>1 k&Omega;</option>
              <option value={2200}>2.2 k&Omega;</option>
              <option value={4700}>4.7 k&Omega;</option>
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Rf</label>
            <select className="field" style={{ marginTop: 8 }} value={rf} onChange={e => setRf(Number(e.target.value))}>
              <option value={10000}>10 k&Omega;</option>
              <option value={22000}>22 k&Omega;</option>
              <option value={47000}>47 k&Omega;</option>
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              Vin amplitude <span className="mono" style={{ color: AMBER }}>{vin.toFixed(1)} V</span>
            </label>
            <input type="range" min="0.2" max="2" step="0.1" value={vin} onChange={e => setVin(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
              <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
            </div>
          </div>
          <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <Readout label="Gain" value={gain.toFixed(2)} />
            <Readout label="Vout peak" value={`${measuredPeak.toFixed(2)} V`} />
          </div>
          {clipped && <p style={{ fontSize: 12.5, color: "#B23A2E", textAlign: "center", margin: 0 }}>Output is clipping at the &plusmn;{RAIL} V supply rails.</p>}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Input and output waveform</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="tMs" type="number" tick={{ fontSize: 12 }} label={{ value: "time (ms)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis domain={[-RAIL - 1, RAIL + 1]} tick={{ fontSize: 12 }} label={{ value: "voltage (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="vin" name="Vin" stroke="#9C948A" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="vout" name="Vout" stroke={TEAL_DARK} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
            {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No readings recorded yet.</p> : (
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                  <th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Mode</th><th style={{ padding: "4px 6px" }}>Rin</th>
                  <th style={{ padding: "4px 6px" }}>Rf</th><th style={{ padding: "4px 6px" }}>Gain</th><th style={{ padding: "4px 6px" }}>Vout pk</th>
                </tr></thead>
                <tbody>
                  {readings.map((row, idx) => (
                    <tr key={row.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}>
                      <td style={{ padding: "5px 6px" }}>{idx + 1}</td><td style={{ padding: "5px 6px" }}>{row.mode}</td><td style={{ padding: "5px 6px" }}>{row.rin}</td>
                      <td style={{ padding: "5px 6px" }}>{row.rf}</td><td style={{ padding: "5px 6px" }}>{row.gain}</td><td style={{ padding: "5px 6px" }}>{row.vout}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>In the inverting configuration, output and input are:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["a", "In phase"], ["b", "180 degrees out of phase"], ["c", "90 degrees shifted"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - that's exactly the flipped waveform you see in inverting mode above." : "Not quite - switch to inverting mode above and look at the two waveforms."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
