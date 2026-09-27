import { useState, useMemo, useRef } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const T0 = 60; // solvent flow time, seconds
const K_HUGGINS = 6.5; // relates concentration to flow time increase
const MARK_K = 1.7e-4;
const MARK_A = 0.71; // Mark-Houwink constants for polystyrene in this solvent

function flowTime(conc) {
  return T0 * (1 + K_HUGGINS * conc * 0.01 + 0.15 * (K_HUGGINS * conc * 0.01) ** 2);
}

export default function ViscometryLab({ setPage }) {
  const [conc, setConc] = useState(0.5);
  const [readings, setReadings] = useState([]);
  const idRef = useRef(1);

  const t = flowTime(conc);
  const record = () => setReadings(prev => [...prev, { id: idRef.current++, c: conc, t: Number(t.toFixed(2)) }]);
  const reset = () => setReadings([]);

  const chartData = useMemo(() => readings.map(r => {
    const etaR = r.t / T0;
    const etaSp = etaR - 1;
    return { c: r.c, etaSpByC: etaSp / r.c };
  }), [readings]);

  const intrinsicViscosity = useMemo(() => {
    if (readings.length < 2) return null;
    const n = chartData.length;
    const sumX = chartData.reduce((a, r) => a + r.c, 0);
    const sumY = chartData.reduce((a, r) => a + r.etaSpByC, 0);
    const sumXY = chartData.reduce((a, r) => a + r.c * r.etaSpByC, 0);
    const sumX2 = chartData.reduce((a, r) => a + r.c * r.c, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    return intercept; // y-intercept at c=0 is intrinsic viscosity
  }, [chartData, readings]);

  const molWeight = intrinsicViscosity !== null ? Math.pow(intrinsicViscosity / MARK_K, 1 / MARK_A) : null;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 6"
      title="Molecular weight of a polymer by viscosity measurement"
      aim="Aim: measure the flow time of polymer solutions of different concentrations through an Ostwald viscometer, extrapolate ηsp/c to zero concentration to get the intrinsic viscosity, and use the Mark-Houwink equation to estimate molecular weight."
      procedure={[
        "Measure the flow time of the pure solvent through the viscometer (t₀).",
        "Prepare polymer solutions of several known concentrations.",
        "Measure the flow time of each solution (t).",
        "Compute relative viscosity ηr = t/t₀, then specific viscosity ηsp = ηr − 1.",
        "Plot ηsp/c against c and extrapolate to c = 0 — the intercept is the intrinsic viscosity [η].",
        "Use [η] = K·Mᵃ (Mark-Houwink equation) to estimate the molecular weight M.",
      ]}
      controls={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Solvent flow time t₀" value={`${T0.toFixed(1)} s`} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Solution concentration <span className="mono" style={{ color: AMBER }}>{conc.toFixed(2)} g/dL</span>
          </label>
          <input type="range" min="0.1" max="2" step="0.1" value={conc} onChange={e => setConc(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={record}>Measure flow time</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Flow time t" value={`${t.toFixed(2)} s`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Huggins plot: ηsp/c vs c</p>
          <div style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer>
              <ScatterChart margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="c" type="number" name="c" tick={{ fontSize: 12 }} label={{ value: "Concentration (g/dL)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis dataKey="etaSpByC" type="number" name="ηsp/c" tick={{ fontSize: 12 }} label={{ value: "ηsp / c", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Scatter data={chartData} fill={TEAL_DARK} line={{ stroke: AMBER, strokeWidth: 1.5 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          {readings.length < 3 && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Measure at least 3-4 different concentrations for a reliable extrapolation.</p>}
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Intrinsic viscosity [η]" value={intrinsicViscosity !== null ? intrinsicViscosity.toFixed(3) : "record ≥ 2 points"} />
          <Readout label="Molecular weight" value={molWeight !== null ? `${(molWeight / 1000).toFixed(0)} kDa` : "—"} />
        </div>
        <VivaCheck
          question="Why do we extrapolate ηsp/c to zero concentration instead of just using one measurement?"
          options={[["a", "To save on chemicals"], ["b", "Polymer chains interact with each other at higher concentrations, so only the c→0 limit isolates the behavior of a single isolated chain"], ["c", "It's required by the viscometer's calibration"]]}
          correctKey="b"
          explanation="At finite concentrations, polymer coils overlap and interact, inflating the measured viscosity beyond what a single chain would contribute. Extrapolating to c = 0 removes these inter-chain effects, giving the true intrinsic viscosity."
        />
      </>}
    />
  );
}
