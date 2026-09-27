import { useState, useMemo, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";

const BETA = 100;
const VCE_KNEE = 0.25;

function computeIc(ibMicroA, vce) {
  const ib = ibMicroA * 1e-6;
  const ic = BETA * ib * (1 - Math.exp(-vce / VCE_KNEE));
  return Math.max(ic, 0);
}

function TransistorCircuitSVG({ vce, ic }) {
  const glow = Math.min(1, (ic * 1000) / 20);
  return (
    <svg viewBox="0 0 260 130" width="100%" height="120">
      <rect x="0" y="0" width="260" height="130" fill="#0F1D27" rx="6" />
      <text x="14" y="20" fill="#7C93A3" fontSize="10" fontFamily="IBM Plex Mono, monospace">Vce = {vce.toFixed(2)} V</text>
      <line x1="130" y1="20" x2="130" y2="45" stroke="#5C7686" strokeWidth="2" />
      <circle cx="130" cy="65" r="22" fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <line x1="118" y1="53" x2="118" y2="77" stroke="#5C7686" strokeWidth="2" />
      <line x1="90" y1="65" x2="118" y2="65" stroke="#5C7686" strokeWidth="2" />
      <line x1="118" y1="58" x2="140" y2="48" stroke={`rgba(217,137,31,${0.3 + glow * 0.7})`} strokeWidth="2" />
      <line x1="118" y1="72" x2="140" y2="82" stroke="#5C7686" strokeWidth="2" />
      <line x1="140" y1="48" x2="140" y2="30" stroke="#5C7686" strokeWidth="2" />
      <line x1="140" y1="82" x2="140" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="140" y1="100" x2="60" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="60" y1="100" x2="60" y2="65" stroke="#5C7686" strokeWidth="2" />
      <text x="70" y="112" fill="#7C93A3" fontSize="9">Ib source</text>
      <circle cx="140" cy="48" r={2 + glow * 4} fill={`rgba(217,137,31,${0.15 + glow * 0.6})`} />
    </svg>
  );
}

export default function TransistorLab({ setPage }) {
  const [ib, setIb] = useState(30);
  const [vce, setVce] = useState(3);
  const [readings, setReadings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const idRef = useRef(1);

  const ic = computeIc(ib, vce);
  const region = vce < VCE_KNEE * 1.5 ? "Saturation" : "Active";

  const record = () => {
    setReadings(prev => [...prev, { id: idRef.current++, ib, vce, ic: Number((ic * 1000).toFixed(3)) }]);
  };
  const reset = () => setReadings([]);
  const chartData = useMemo(() => readings.map(p => ({ vce: p.vce, ic: p.ic })), [readings]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>BJT characteristics &mdash; CE configuration</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: plot output characteristics (Ic vs Vce) for a fixed base current, and identify the saturation and active regions.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Circuit</p>
            <TransistorCircuitSVG vce={vce} ic={ic} />
          </div>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
              Base current (Ib) <span className="mono" style={{ color: AMBER }}>{ib} &micro;A</span>
            </label>
            <input type="range" min="10" max="100" step="10" value={ib} onChange={e => setIb(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              Vce <span className="mono" style={{ color: AMBER }}>{vce.toFixed(2)} V</span>
            </label>
            <input type="range" min="0" max="10" step="0.1" value={vce} onChange={e => setVce(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
              <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
            </div>
          </div>
          <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
            <Readout label="Collector current" value={`${(ic * 1000).toFixed(3)} mA`} />
            <Readout label="Region" value={region} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Ic vs Vce (output characteristics)</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="vce" type="number" name="Vce" unit="V" domain={[0, 10]} tick={{ fontSize: 12 }} label={{ value: "Vce (V)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis dataKey="ic" type="number" name="Ic" unit="mA" tick={{ fontSize: 12 }} label={{ value: "Ic (mA)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                  <Tooltip />
                  <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} lineType="joint" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {readings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Sweep Vce at a fixed Ib and record points to trace one curve; change Ib for another curve.</p>}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
            {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No readings recorded yet.</p> : (
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                  <th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Ib (&micro;A)</th><th style={{ padding: "4px 6px" }}>Vce (V)</th><th style={{ padding: "4px 6px" }}>Ic (mA)</th>
                </tr></thead>
                <tbody>
                  {readings.map((row, idx) => (
                    <tr key={row.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}>
                      <td style={{ padding: "5px 6px" }}>{idx + 1}</td><td style={{ padding: "5px 6px" }}>{row.ib}</td><td style={{ padding: "5px 6px" }}>{row.vce.toFixed(2)}</td><td style={{ padding: "5px 6px" }}>{row.ic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>In the active region, Ic is mainly controlled by:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["a", "Vce"], ["b", "Ib"], ["c", "Supply voltage only"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - in the active region Ic is roughly beta times Ib, almost flat with Vce." : "Not quite - the flat spacing between curves at different Ib is exactly what shows Ic tracks Ib."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
