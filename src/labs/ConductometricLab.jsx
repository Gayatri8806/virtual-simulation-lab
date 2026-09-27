import { useState, useMemo, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import BuretteSVG from "./chem/BuretteSVG";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V1_TRUE = 10; // mL NaOH to neutralize strong acid (HCl)
const V2_TRUE = 22; // mL NaOH to neutralize both acids (HCl + CH3COOH)

function conductivityAt(v) {
  if (v <= V1_TRUE) {
    return 100 - 6 * v; // steep fall: H+ replaced by Na+
  } else if (v <= V2_TRUE) {
    const base = 100 - 6 * V1_TRUE;
    return base + 0.8 * (v - V1_TRUE); // gentle rise: weak acid salt forming
  } else {
    const base = 100 - 6 * V1_TRUE + 0.8 * (V2_TRUE - V1_TRUE);
    return base + 4 * (v - V2_TRUE); // steep rise: excess NaOH
  }
}

export default function ConductometricLab({ setPage }) {
  const [volume, setVolume] = useState(0);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const cond = conductivityAt(volume);
  const record = () => setReadings(prev => [...prev, { id: idRef.current++, v: volume, cond: Number(cond.toFixed(1)) }]);
  const reset = () => { setVolume(0); setReadings([]); };

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 4"
      title="Conductometric titration of a strong + weak acid mixture"
      aim="Aim: titrate a mixture of a strong acid (HCl) and a weak acid (acetic acid) against standard NaOH, tracking conductivity, and locate the two breakpoints to find the amount of each acid separately."
      procedure={[
        "Pipette the acid mixture into a beaker and dip in the conductivity cell.",
        "Fill the burette with standard NaOH.",
        "Add NaOH in small steps, recording conductivity after each addition — even where it doesn't seem to be changing much.",
        "Continue well past the point where conductivity starts rising steeply again.",
        "Plot conductivity vs volume — you should see two straight-line segments with different slopes, meeting at two breakpoints V1 and V2.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Burette (standard NaOH)</p>
          <BuretteSVG volume={volume} maxVolume={35} flaskColor="#EDE7DC" label="acid mixture + probe" />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Add NaOH <span className="mono" style={{ color: AMBER }}>{volume.toFixed(1)} mL</span>
          </label>
          <input type="range" min="0" max="35" step="0.5" value={volume} onChange={e => setVolume(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Record conductivity</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Conductivity (relative)" value={cond.toFixed(1)} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Conductivity vs volume</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={readings} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="v" type="number" tick={{ fontSize: 12 }} label={{ value: "Volume NaOH (mL)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: "Conductivity", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="cond" stroke={TEAL_DARK} dot={{ r: 3 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {readings.length < 4 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Record readings across the full range (0-35 mL) to see both breakpoints clearly.</p>}
        </div>
        <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Look for where the slope of the line changes — those are your two breakpoints, V1 (strong acid neutralized) and V2 (both acids neutralized).</p>
        <VivaCheck
          question="Why does conductivity fall steeply in the first stage of this titration?"
          options={[["a", "Water is being added, diluting everything"], ["b", "Highly mobile H⁺ ions are being replaced by much less mobile Na⁺ ions as the strong acid is neutralized"], ["c", "The weak acid is decomposing"]]}
          correctKey="b"
          explanation="H⁺ has an exceptionally high ionic mobility compared to almost any other ion. As NaOH neutralizes the strong acid, H⁺ is progressively replaced by Na⁺, causing a sharp drop in conductivity — the steepest segment of the curve."
        />
      </>}
    />
  );
}
