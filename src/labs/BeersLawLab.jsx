import { useState, useMemo, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const EPSILON = 0.018; // molar absorptivity-ish constant for this CuSO4 solution
const UNKNOWN_CONC_TRUE = 32; // hidden true concentration, ppm

function absorbanceAt(conc) {
  return EPSILON * conc;
}

export default function BeersLawLab({ setPage }) {
  const [conc, setConc] = useState(10);
  const [isUnknown, setIsUnknown] = useState(false);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const activeConc = isUnknown ? UNKNOWN_CONC_TRUE : conc;
  const absorbance = absorbanceAt(activeConc);

  const record = () => setReadings(prev => [...prev, { id: idRef.current++, conc, absorbance: Number(absorbance.toFixed(3)), isUnknown }]);
  const reset = () => setReadings([]);

  const knownReadings = readings.filter(r => !r.isUnknown);
  const unknownReading = readings.filter(r => r.isUnknown).slice(-1)[0];

  const slope = useMemo(() => {
    if (knownReadings.length < 2) return null;
    const n = knownReadings.length;
    const sumX = knownReadings.reduce((a, r) => a + r.conc, 0);
    const sumY = knownReadings.reduce((a, r) => a + r.absorbance, 0);
    const sumXY = knownReadings.reduce((a, r) => a + r.conc * r.absorbance, 0);
    const sumX2 = knownReadings.reduce((a, r) => a + r.conc * r.conc, 0);
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }, [knownReadings]);

  const unknownConcEstimate = slope !== null && unknownReading ? unknownReading.absorbance / slope : null;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 5"
      title="Verification of Beer's law & unknown concentration by colorimetry"
      aim="Aim: measure the absorbance of a colored solution (CuSO₄) at several known concentrations, build a calibration curve, verify Beer's law (A ∝ c), and use the curve to find the concentration of an unknown sample."
      procedure={[
        "Prepare a series of CuSO₄ solutions of known concentration (e.g. 5, 10, 20, 30, 40 ppm).",
        "Set the colorimeter to the wavelength of maximum absorption for this solution.",
        "Measure and record the absorbance of each known solution.",
        "Plot absorbance vs concentration — it should be a straight line through the origin (Beer's law).",
        "Measure the absorbance of the unknown sample and use the calibration line to find its concentration.",
      ]}
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Sample</label>
          <select className="field" style={{ marginTop: 6 }} value={isUnknown ? "unknown" : "known"} onChange={e => setIsUnknown(e.target.value === "unknown")}>
            <option value="known">Known standard</option>
            <option value="unknown">Unknown sample</option>
          </select>
          {!isUnknown && (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                Concentration <span className="mono" style={{ color: AMBER }}>{conc} ppm</span>
              </label>
              <input type="range" min="0" max="50" step="1" value={conc} onChange={e => setConc(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
            </>
          )}
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={record}>Measure absorbance</button>
          <button className="btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset</button>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Absorbance" value={absorbance.toFixed(3)} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Calibration curve</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="conc" type="number" name="conc" unit=" ppm" tick={{ fontSize: 12 }} label={{ value: "Concentration (ppm)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis dataKey="absorbance" type="number" name="A" tick={{ fontSize: 12 }} label={{ value: "Absorbance", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Scatter data={knownReadings} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} />
                <Scatter data={readings.filter(r => r.isUnknown)} fill="#E24B3D" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {knownReadings.length === 0 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Measure 4-5 known standards first, then measure the unknown.</p>}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Unknown concentration" value={unknownConcEstimate !== null ? `${unknownConcEstimate.toFixed(1)} ppm` : "need calibration + unknown reading"} />
        </div>
        <VivaCheck
          question="Beer's law states that absorbance is directly proportional to:"
          options={[["a", "The color of the solution only"], ["b", "The concentration of the absorbing species (for a fixed path length)"], ["c", "The volume of the cuvette"]]}
          correctKey="b"
          explanation="A = εcl — absorbance is proportional to concentration (c) at a fixed molar absorptivity (ε) and path length (l), which is exactly why a linear calibration curve lets you find an unknown concentration from its absorbance."
        />
      </>}
    />
  );
}
