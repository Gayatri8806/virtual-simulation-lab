import { useState, useMemo } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const RATED_KVA = 1;
const V1 = 230, V2_NL = 115; // no-load secondary voltage
const IRON_LOSS = 15; // W, constant
const R_EQ = 0.8; // equivalent resistance referred to secondary, ohms (for copper loss)

export default function TransformerTestLab({ setPage }) {
  const [loadPct, setLoadPct] = useState(0);
  const [readings, setReadings] = useState([]);

  const ratedI2 = (RATED_KVA * 1000) / V2_NL;
  const i2 = (loadPct / 100) * ratedI2;
  const copperLoss = i2 * i2 * R_EQ;
  const totalLoss = IRON_LOSS + copperLoss;
  const outputPower = V2_NL * i2 * 0.8; // assume 0.8 pf load
  const inputPower = outputPower + totalLoss;
  const efficiency = inputPower > 0 ? (outputPower / inputPower) * 100 : 0;
  const voltageDrop = i2 * R_EQ; // simplified regulation model
  const v2OnLoad = V2_NL - voltageDrop;
  const regulation = ((V2_NL - v2OnLoad) / V2_NL) * 100;

  const record = () => setReadings(prev => [...prev, { load: loadPct, eff: efficiency.toFixed(2), reg: regulation.toFixed(2) }]);
  const reset = () => setReadings([]);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 5"
      title="Efficiency and regulation of a transformer (direct loading test)"
      aim="Aim: load a single-phase transformer progressively from no-load to full-load, measuring output power and losses at each step, to determine its efficiency and voltage regulation."
      procedure={[
        "With no load connected, note the no-load secondary voltage.",
        "Connect a variable resistive load and increase it in steps, recording secondary voltage and current at each step.",
        "At each load point, compute output power (V₂I₂cosφ), total losses (iron + copper), and hence efficiency.",
        "Compute regulation as the percentage drop in secondary voltage from no-load to that load current.",
        "Plot efficiency vs load percentage — it should peak somewhere around where copper loss equals iron loss.",
      ]}
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Load <span className="mono" style={{ color: AMBER }}>{loadPct}% of rated</span>
          </label>
          <input type="range" min="0" max="150" step="5" value={loadPct} onChange={e => setLoadPct(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record reading</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Readout label="Secondary current I2" value={`${i2.toFixed(2)} A`} />
          <Readout label="Secondary voltage (on load)" value={`${v2OnLoad.toFixed(1)} V`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Observation table</p>
          {readings.length === 0 ? <p style={{ fontSize: 13, color: INK_SOFT }}>Record a few load points from 0% to 150%.</p> : (
            <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
              <thead><tr style={{ textAlign: "left", color: INK_SOFT }}><th style={{ padding: "4px 6px" }}>Load %</th><th style={{ padding: "4px 6px" }}>Efficiency %</th><th style={{ padding: "4px 6px" }}>Regulation %</th></tr></thead>
              <tbody>{readings.map((r, i) => (
                <tr key={i} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}><td style={{ padding: "5px 6px" }}>{r.load}</td><td style={{ padding: "5px 6px" }}>{r.eff}</td><td style={{ padding: "5px 6px" }}>{r.reg}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Efficiency (current load)" value={`${efficiency.toFixed(2)}%`} />
          <Readout label="Regulation (current load)" value={`${regulation.toFixed(2)}%`} />
        </div>
        <VivaCheck
          question="Transformer efficiency is typically highest when:"
          options={[["a", "The transformer is fully unloaded"], ["b", "Copper loss (which grows with I²) equals the constant iron loss"], ["c", "The load is at 200% of rated capacity"]]}
          correctKey="b"
          explanation="Iron loss is roughly constant regardless of load, while copper loss grows with the square of current. Total loss (and hence efficiency) is optimized exactly where these two losses are equal — this is a classic transformer design result."
        />
      </>}
    />
  );
}
