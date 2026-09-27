import { useState, useMemo, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";
import CircuitSVG from "./CircuitSVG";
import { solveDiodeCurrent } from "./diodeMath";

export default function DiodeLab({ setPage }) {
  const [vSource, setVSource] = useState(1.5);
  const [r, setR] = useState(220);
  const [readings, setReadings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const idRef = useRef(1);

  const i = solveDiodeCurrent(vSource, r);
  const vd = vSource - i * r;
  const iMa = i * 1000;

  const record = () => {
    setReadings(prev => [...prev, { id: idRef.current++, vs: vSource, r, vd: Number(vd.toFixed(3)), i: Number(iMa.toFixed(3)) }]);
  };
  const reset = () => setReadings([]);
  const chartData = useMemo(() => readings.map(pt => ({ vd: pt.vd, i: pt.i })), [readings]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>PN junction diode &mdash; V-I characteristics</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: plot the forward-bias V-I characteristic of a silicon diode and find its knee (cut-in) voltage.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Circuit</p>
            <CircuitSVG vSource={vSource} iMa={iMa} />
          </div>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
              Source voltage <span className="mono" style={{ color: AMBER }}>{vSource.toFixed(2)} V</span>
            </label>
            <input type="range" min="0" max="5" step="0.05" value={vSource} onChange={e => setVSource(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Series resistor</label>
            <select className="field" style={{ marginTop: 8 }} value={r} onChange={e => setR(Number(e.target.value))}>
              <option value={100}>100 &Omega;</option>
              <option value={220}>220 &Omega;</option>
              <option value={470}>470 &Omega;</option>
              <option value={1000}>1000 &Omega;</option>
            </select>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
              <button className="btn-outline" onClick={reset} title="Clear readings"><RotateCcw size={15} /></button>
            </div>
          </div>

          <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
            <Readout label="Diode voltage" value={`${vd.toFixed(3)} V`} />
            <Readout label="Diode current" value={`${iMa.toFixed(3)} mA`} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>V-I graph (your recorded readings)</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="vd" type="number" name="Vd" unit="V" domain={[0, 1]} tick={{ fontSize: 12 }} label={{ value: "Diode voltage (V)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis dataKey="i" type="number" name="I" unit="mA" tick={{ fontSize: 12 }} label={{ value: "Current (mA)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                  <Tooltip />
                  <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} lineType="joint" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            {readings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Move the slider and click "Record reading" to plot points.</p>}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
            {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No readings recorded yet.</p> : (
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                  <th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Vs (V)</th><th style={{ padding: "4px 6px" }}>R (&Omega;)</th><th style={{ padding: "4px 6px" }}>Vd (V)</th><th style={{ padding: "4px 6px" }}>I (mA)</th>
                </tr></thead>
                <tbody>
                  {readings.map((row, idx) => (
                    <tr key={row.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}>
                      <td style={{ padding: "5px 6px" }}>{idx + 1}</td><td style={{ padding: "5px 6px" }}>{row.vs.toFixed(2)}</td><td style={{ padding: "5px 6px" }}>{row.r}</td><td style={{ padding: "5px 6px" }}>{row.vd}</td><td style={{ padding: "5px 6px" }}>{row.i}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>The knee (cut-in) voltage of a silicon diode is approximately:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["a", "0.2 V"], ["b", "0.6-0.7 V"], ["c", "2.0 V"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - silicon diodes conduct noticeably from about 0.6-0.7 V." : "Not quite - germanium is closer to 0.2 V; silicon's knee sits around 0.6-0.7 V."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
