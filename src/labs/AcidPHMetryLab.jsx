import { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import BuretteSVG from "./chem/BuretteSVG";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const N_ACID_TRUE = 0.098; // hidden true normality of the unknown HCl
const V_ACID = 25; // mL of acid taken
const N_BASE = 0.1; // standard NaOH normality
const EQUIV_V = (N_ACID_TRUE * V_ACID) / N_BASE;

function pHAt(vBase) {
  const molesAcid = N_ACID_TRUE * V_ACID;
  const molesBase = N_BASE * vBase;
  const totalV = V_ACID + vBase;
  const net = molesAcid - molesBase;
  if (Math.abs(net) < 1e-6) return 7;
  if (net > 0) {
    const hConc = net / totalV;
    return -Math.log10(hConc);
  }
  const ohConc = -net / totalV;
  return 14 + Math.log10(ohConc);
}

export default function AcidPHMetryLab({ setPage }) {
  const [volume, setVolume] = useState(0);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const ph = pHAt(volume);
  const record = () => setReadings(prev => [...prev, { id: idRef.current++, v: volume, ph: Number(ph.toFixed(2)) }]);
  const reset = () => { setVolume(0); setReadings([]); };

  const steepestPoint = useMemo(() => {
    if (readings.length < 2) return null;
    let maxSlope = 0, atV = null;
    for (let i = 1; i < readings.length; i++) {
      const dv = readings[i].v - readings[i - 1].v;
      if (dv === 0) continue;
      const slope = Math.abs((readings[i].ph - readings[i - 1].ph) / dv);
      if (slope > maxSlope) { maxSlope = slope; atV = (readings[i].v + readings[i - 1].v) / 2; }
    }
    return atV;
  }, [readings]);

  const nAcidEstimate = steepestPoint !== null ? (N_BASE * steepestPoint) / V_ACID : null;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 3"
      title="pH-metric titration of a strong acid vs a strong base"
      aim="Aim: titrate an unknown strong acid against standard NaOH, recording pH after each addition, and locate the equivalence point from the steepest jump in the pH curve."
      procedure={[
        "Pipette 25 mL of the unknown HCl sample into a beaker and dip in the pH probe.",
        "Fill the burette with standard 0.1 N NaOH.",
        "Add NaOH in small increments, recording the pH reading after each addition.",
        "Near the expected equivalence point, add NaOH in very small steps (0.1-0.5 mL) since pH changes sharply here.",
        "Plot pH vs volume of NaOH added; the point of steepest rise is the equivalence point.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Burette (0.1 N NaOH)</p>
          <BuretteSVG volume={volume} maxVolume={40} flaskColor="#EDE7DC" label="acid + pH probe" />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Add NaOH <span className="mono" style={{ color: AMBER }}>{volume.toFixed(1)} mL</span>
          </label>
          <input type="range" min="0" max="40" step="0.1" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record pH reading</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="pH meter reading" value={ph.toFixed(2)} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>pH vs volume of NaOH</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={readings} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="v" type="number" tick={{ fontSize: 12 }} label={{ value: "Volume NaOH (mL)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis domain={[0, 14]} tick={{ fontSize: 12 }} label={{ value: "pH", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <ReferenceLine y={7} stroke="#5C7686" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ph" stroke={TEAL_DARK} dot={{ r: 3 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Equivalence volume (steepest jump)" value={steepestPoint !== null ? `${steepestPoint.toFixed(1)} mL` : "record ≥ 3 points"} />
          <Readout label="Acid normality" value={nAcidEstimate !== null ? nAcidEstimate.toFixed(4) : "—"} />
        </div>
        <VivaCheck
          question="At the equivalence point of a strong acid-strong base titration, the pH is:"
          options={[["a", "Always 0"], ["b", "About 7 (neutral)"], ["c", "Always 14"]]}
          correctKey="b"
          explanation="Neutralizing a strong acid with a strong base produces a neutral salt (like NaCl) with no hydrolysis — so the equivalence point sits right at pH 7, which is also where the curve is steepest."
        />
      </>}
    />
  );
}
