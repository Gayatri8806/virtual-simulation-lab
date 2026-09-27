import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V = 5, R = 50, L = 0.1, C = 1e-6;
const F_RESONANCE = 1 / (2 * Math.PI * Math.sqrt(L * C));

function currentAt(f) {
  const w = 2 * Math.PI * f;
  const xl = w * L;
  const xc = 1 / (w * C);
  const z = Math.sqrt(R * R + (xl - xc) ** 2);
  return V / z;
}

export default function RLCResonanceLab({ setPage }) {
  const [freq, setFreq] = useState(F_RESONANCE);

  const current = currentAt(freq);

  const curve = useMemo(() => {
    const pts = [];
    for (let f = 100; f <= F_RESONANCE * 3; f += F_RESONANCE * 3 / 80) {
      pts.push({ f: Number(f.toFixed(0)), i: Number((currentAt(f) * 1000).toFixed(3)) });
    }
    return pts;
  }, []);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 7"
      title="Series RLC resonance"
      aim="Aim: sweep the supply frequency across a series RLC circuit and locate the resonant frequency — where inductive and capacitive reactance cancel, current peaks, and impedance is purely resistive."
      procedure={[
        "Set up the series RLC circuit with the given fixed R, L, and C values.",
        "Sweep the source frequency and record the current at each step.",
        "Plot current vs frequency — it should peak sharply at the resonant frequency.",
        "Verify the peak occurs at f₀ = 1 / (2π√(LC)).",
      ]}
      controls={<>
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Readout label="R" value={`${R} Ω`} />
          <Readout label="L" value={`${L} H`} />
          <Readout label="C" value={`${(C * 1e6).toFixed(1)} µF`} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
            Supply frequency <span className="mono" style={{ color: AMBER }}>{freq.toFixed(0)} Hz</span>
          </label>
          <input type="range" min="100" max={F_RESONANCE * 3} step="10" value={freq} onChange={e => setFreq(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Current" value={`${(current * 1000).toFixed(2)} mA`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Current vs frequency</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={curve} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="f" type="number" tick={{ fontSize: 12 }} label={{ value: "Frequency (Hz)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: "Current (mA)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <ReferenceLine x={Number(F_RESONANCE.toFixed(0))} stroke={AMBER} strokeDasharray="4 3" label={{ value: "f₀", fontSize: 11, fill: AMBER }} />
                <Line type="monotone" dataKey="i" stroke={TEAL_DARK} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Theoretical resonant frequency f₀" value={`${F_RESONANCE.toFixed(1)} Hz`} />
        </div>
        <VivaCheck
          question="At resonance in a series RLC circuit, the impedance is:"
          options={[["a", "Infinite"], ["b", "Purely resistive (equal to R), since inductive and capacitive reactances cancel"], ["c", "Zero"]]}
          correctKey="b"
          explanation="At resonance, XL = XC, so their combined reactance (XL − XC) is zero — leaving only R as the total impedance, which is exactly why current peaks at this frequency for a fixed supply voltage."
        />
      </>}
    />
  );
}
