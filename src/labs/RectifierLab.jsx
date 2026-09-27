import { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";

const FREQ = 50; // Hz
const DIODE_DROP = 0.7;
const R_LOAD = 1000; // ohm

function simulate(type, vm, capUF) {
  const cycles = 2;
  const points = 400;
  const T = 1 / FREQ;
  const dt = (cycles * T) / points;
  const C = capUF * 1e-6;
  const RC = C > 0 ? R_LOAD * C : 0;

  let capV = 0;
  const data = [];
  for (let n = 0; n <= points; n++) {
    const t = n * dt;
    const vin = vm * Math.sin(2 * Math.PI * FREQ * t);
    let rectified;
    if (type === "half") {
      rectified = vin > DIODE_DROP ? vin - DIODE_DROP : 0;
    } else {
      const rectFull = Math.abs(vin) - 2 * DIODE_DROP;
      rectified = rectFull > 0 ? rectFull : 0;
    }
    if (C > 0) {
      if (rectified > capV) capV = rectified;
      else capV = capV * Math.exp(-dt / RC);
    } else {
      capV = rectified;
    }
    data.push({ tMs: Number((t * 1000).toFixed(3)), vin: Number(vin.toFixed(2)), vout: Number(capV.toFixed(2)) });
  }
  return data;
}

export default function RectifierLab({ setPage }) {
  const [type, setType] = useState("half");
  const [vm, setVm] = useState(12);
  const [capUF, setCapUF] = useState(0);
  const [comparisons, setComparisons] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const idRef = useRef(1);

  const data = useMemo(() => simulate(type, vm, capUF), [type, vm, capUF]);

  const lastCycle = data.slice(Math.floor(data.length / 2));
  const voutVals = lastCycle.map(d => d.vout);
  const vAvg = voutVals.reduce((a, b) => a + b, 0) / voutVals.length;
  const vMax = Math.max(...voutVals);
  const vMin = Math.min(...voutVals);
  const ripple = vAvg > 0 ? (vMax - vMin) / (2 * Math.sqrt(3) * vAvg) : 0;

  const record = () => {
    setComparisons(prev => [...prev, { id: idRef.current++, type, vm, capUF, vdc: Number(vAvg.toFixed(2)), ripple: Number(ripple.toFixed(3)) }]);
  };
  const reset = () => setComparisons([]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>Rectifier with capacitor filter</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: compare half-wave and full-wave rectified output with and without a filter capacitor, and measure ripple.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Rectifier type</label>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-outline" style={{ flex: 1, background: type === "half" ? "#E4EFEC" : "transparent" }} onClick={() => setType("half")}>Half-wave</button>
              <button className="btn-outline" style={{ flex: 1, background: type === "full" ? "#E4EFEC" : "transparent" }} onClick={() => setType("full")}>Full-wave</button>
            </div>

            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              Peak input (Vm) <span className="mono" style={{ color: AMBER }}>{vm} V</span>
            </label>
            <input type="range" min="5" max="20" step="1" value={vm} onChange={e => setVm(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Filter capacitor</label>
            <select className="field" style={{ marginTop: 8 }} value={capUF} onChange={e => setCapUF(Number(e.target.value))}>
              <option value={0}>No filter</option>
              <option value={100}>100 &micro;F</option>
              <option value={470}>470 &micro;F</option>
              <option value={1000}>1000 &micro;F</option>
            </select>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Log this setting</button>
              <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
            </div>
          </div>
          <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <Readout label="Vdc (avg)" value={`${vAvg.toFixed(2)} V`} />
            <Readout label="Ripple factor" value={ripple.toFixed(3)} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Input and output waveform</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="tMs" type="number" tick={{ fontSize: 12 }} label={{ value: "time (ms)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} label={{ value: "voltage (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="vin" name="Vin" stroke="#9C948A" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="vout" name="Vout" stroke={TEAL_DARK} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Comparison log</p>
            {comparisons.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>Log a few settings to compare ripple side by side.</p> : (
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                  <th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Type</th><th style={{ padding: "4px 6px" }}>Vm (V)</th>
                  <th style={{ padding: "4px 6px" }}>C (&micro;F)</th><th style={{ padding: "4px 6px" }}>Vdc (V)</th><th style={{ padding: "4px 6px" }}>Ripple</th>
                </tr></thead>
                <tbody>
                  {comparisons.map((row, idx) => (
                    <tr key={row.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}>
                      <td style={{ padding: "5px 6px" }}>{idx + 1}</td><td style={{ padding: "5px 6px" }}>{row.type}</td><td style={{ padding: "5px 6px" }}>{row.vm}</td>
                      <td style={{ padding: "5px 6px" }}>{row.capUF || "-"}</td><td style={{ padding: "5px 6px" }}>{row.vdc}</td><td style={{ padding: "5px 6px" }}>{row.ripple}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>Compared to half-wave, a full-wave rectifier's ripple is:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["a", "Higher"], ["b", "Lower"], ["c", "Identical"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - the capacitor recharges twice as often, so it discharges less between peaks." : "Not quite - try switching the type above and comparing the ripple factor readout."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
