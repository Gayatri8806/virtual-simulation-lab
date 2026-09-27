import { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import Readout from "../components/Readout";

function computeZener(vin, vz, r, rl) {
  const voc = (vin * rl) / (rl + r); // output if zener were absent (open circuit divider)
  if (voc <= vz) {
    const vout = voc;
    const itotal = (vin - vout) / r;
    return { vout, iz: 0, il: itotal, regulating: false };
  }
  const vout = vz;
  const itotal = (vin - vout) / r;
  const il = vout / rl;
  const iz = Math.max(itotal - il, 0);
  return { vout, iz, il, regulating: true };
}

function ZenerCircuitSVG({ vin, regulating }) {
  const glow = regulating ? 1 : 0.15;
  return (
    <svg viewBox="0 0 260 130" width="100%" height="120">
      <rect x="0" y="0" width="260" height="130" fill="#0F1D27" rx="6" />
      <text x="14" y="20" fill="#7C93A3" fontSize="10" fontFamily="IBM Plex Mono, monospace">Vin = {vin.toFixed(1)} V</text>
      <line x1="20" y1="65" x2="60" y2="65" stroke="#5C7686" strokeWidth="2" />
      <line x1="60" y1="30" x2="60" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="60" y1="30" x2="140" y2="30" stroke="#5C7686" strokeWidth="2" />
      <rect x="140" y="20" width="40" height="20" fill="none" stroke="#5C7686" strokeWidth="2" />
      <text x="145" y="17" fill="#7C93A3" fontSize="9">R</text>
      <line x1="180" y1="30" x2="220" y2="30" stroke="#5C7686" strokeWidth="2" />
      <line x1="220" y1="30" x2="220" y2="55" stroke="#5C7686" strokeWidth="2" />
      <polygon points="210,70 230,70 220,50" fill={`rgba(217,137,31,${0.2 + glow * 0.6})`} stroke={AMBER} strokeWidth="1.5" />
      <line x1="210" y1="50" x2="230" y2="50" stroke={AMBER} strokeWidth="2" />
      <line x1="220" y1="70" x2="220" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="220" y1="100" x2="60" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="180" y1="30" x2="180" y2="100" stroke="#5C7686" strokeWidth="2" strokeDasharray="3 3" />
      <rect x="170" y="55" width="20" height="20" fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <text x="192" y="68" fill="#7C93A3" fontSize="9">RL</text>
      <circle cx="220" cy="60" r={2 + glow * 3} fill={`rgba(217,137,31,${0.15 + glow * 0.5})`} />
    </svg>
  );
}

export default function ZenerLab({ setPage }) {
  const [vin, setVin] = useState(6);
  const [vz, setVz] = useState(5.6);
  const [r, setR] = useState(220);
  const [rl, setRl] = useState(1000);
  const [readings, setReadings] = useState([]);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const idRef = useRef(1);

  const { vout, iz, il, regulating } = computeZener(vin, vz, r, rl);

  const record = () => {
    setReadings(prev => [...prev, { id: idRef.current++, vin, vout: Number(vout.toFixed(2)), iz: Number((iz * 1000).toFixed(2)), il: Number((il * 1000).toFixed(2)) }]);
  };
  const reset = () => setReadings([]);
  const chartData = useMemo(() => readings.map(p => ({ vin: p.vin, vout: p.vout })), [readings]);
  const quizCorrect = quizAnswer === "b";

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 40px 70px" }}>
      <span onClick={() => setPage("labs-electronics")} style={{ color: INK_SOFT, fontSize: 13, cursor: "pointer" }}>&larr; Back to electronics labs</span>
      <p className="mono" style={{ color: TEAL_DARK, fontSize: 13, margin: "14px 0 4px" }}>basic electronics engineering</p>
      <h2 style={{ fontFamily: "Spectral, serif", fontSize: 30, margin: "0 0 6px" }}>Zener diode as a voltage regulator</h2>
      <p style={{ color: INK_SOFT, fontSize: 14.5, maxWidth: 640, marginBottom: 30 }}>
        Aim: verify that a reverse-biased Zener diode holds Vout roughly constant once Vin exceeds the breakdown voltage.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Circuit</p>
            <ZenerCircuitSVG vin={vin} regulating={regulating} />
          </div>
          <div className="card">
            <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
              Input voltage (Vin) <span className="mono" style={{ color: AMBER }}>{vin.toFixed(1)} V</span>
            </label>
            <input type="range" min="0" max="15" step="0.2" value={vin} onChange={e => setVin(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Zener breakdown voltage (Vz)</label>
            <select className="field" style={{ marginTop: 8 }} value={vz} onChange={e => setVz(Number(e.target.value))}>
              <option value={3.3}>3.3 V</option>
              <option value={5.6}>5.6 V</option>
              <option value={6.2}>6.2 V</option>
              <option value={9.1}>9.1 V</option>
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Series resistor (R)</label>
            <select className="field" style={{ marginTop: 8 }} value={r} onChange={e => setR(Number(e.target.value))}>
              <option value={100}>100 &Omega;</option>
              <option value={220}>220 &Omega;</option>
              <option value={470}>470 &Omega;</option>
            </select>

            <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 16 }}>Load resistor (RL)</label>
            <select className="field" style={{ marginTop: 8 }} value={rl} onChange={e => setRl(Number(e.target.value))}>
              <option value={470}>470 &Omega;</option>
              <option value={1000}>1 k&Omega;</option>
              <option value={4700}>4.7 k&Omega;</option>
            </select>

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
              <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
            </div>
          </div>
          <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <Readout label="Vout" value={`${vout.toFixed(2)} V`} />
            <Readout label="Iz" value={`${(iz * 1000).toFixed(2)} mA`} />
            <Readout label="IL" value={`${(il * 1000).toFixed(2)} mA`} />
          </div>
          <p style={{ fontSize: 12.5, color: regulating ? TEAL_DARK : "#B23A2E", textAlign: "center", margin: 0 }}>
            {regulating ? "Regulating: Vout is clamped to Vz." : "Not regulating yet: Vin too low, no current through the Zener."}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Vout vs Vin (regulation curve)</p>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid stroke="#E4DFCE" />
                  <XAxis dataKey="vin" type="number" domain={[0, 15]} tick={{ fontSize: 12 }} label={{ value: "Vin (V)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                  <YAxis dataKey="vout" type="number" tick={{ fontSize: 12 }} label={{ value: "Vout (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                  <ReferenceLine y={vz} stroke={AMBER} strokeDasharray="4 4" />
                  <Tooltip />
                  <Line type="monotone" dataKey="vout" stroke={TEAL_DARK} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {readings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Sweep Vin and record several readings to see the flat region appear.</p>}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
            {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>No readings recorded yet.</p> : (
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead><tr style={{ textAlign: "left", color: INK_SOFT }}>
                  <th style={{ padding: "4px 6px" }}>#</th><th style={{ padding: "4px 6px" }}>Vin (V)</th><th style={{ padding: "4px 6px" }}>Vout (V)</th>
                  <th style={{ padding: "4px 6px" }}>Iz (mA)</th><th style={{ padding: "4px 6px" }}>IL (mA)</th>
                </tr></thead>
                <tbody>
                  {readings.map((row, idx) => (
                    <tr key={row.id} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}>
                      <td style={{ padding: "5px 6px" }}>{idx + 1}</td><td style={{ padding: "5px 6px" }}>{row.vin.toFixed(1)}</td>
                      <td style={{ padding: "5px 6px" }}>{row.vout}</td><td style={{ padding: "5px 6px" }}>{row.iz}</td><td style={{ padding: "5px 6px" }}>{row.il}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Viva check</p>
            <p style={{ fontSize: 14, marginBottom: 10 }}>A Zener regulator is connected in:</p>
            <div style={{ display: "flex", gap: 10 }}>
              {[["a", "Forward bias"], ["b", "Reverse bias"], ["c", "No bias"]].map(([key, label]) => (
                <button key={key} className="btn-outline"
                  style={{ borderColor: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : "#C9C2AE", color: quizAnswer === key ? (quizCorrect && key === "b" ? TEAL_DARK : "#B23A2E") : undefined }}
                  onClick={() => setQuizAnswer(key)}>{label}</button>
              ))}
            </div>
            {quizAnswer && (
              <p style={{ marginTop: 10, fontSize: 13.5, display: "flex", alignItems: "center", gap: 6, color: quizCorrect ? TEAL_DARK : "#B23A2E" }}>
                {quizCorrect ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                {quizCorrect ? "Correct - reverse bias is what puts it into the constant-voltage breakdown region." : "Not quite - the regulator only clamps voltage once it's reverse biased into breakdown."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
