import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V = 10;

export default function TransientResponseLab({ setPage }) {
  const [circuitType, setCircuitType] = useState("RL");
  const [r, setR] = useState(1000);
  const [lOrC, setLOrC] = useState(circuitType === "RL" ? 0.5 : 1e-6);
  const [switchClosed, setSwitchClosed] = useState(false);

  const tau = circuitType === "RL" ? lOrC / r : r * lOrC;

  const curve = useMemo(() => {
    const pts = [];
    const tMax = tau * 5;
    for (let i = 0; i <= 60; i++) {
      const t = (tMax * i) / 60;
      let value;
      if (circuitType === "RL") {
        value = (V / r) * (1 - Math.exp(-t / tau)) * 1000; // current in mA
      } else {
        value = V * (1 - Math.exp(-t / tau)); // voltage across capacitor
      }
      pts.push({ t: Number((t * 1000).toFixed(2)), value: Number(value.toFixed(3)) });
    }
    return pts;
  }, [circuitType, r, lOrC, tau]);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 6"
      title="Transient response of RL and RC circuits"
      aim="Aim: close a switch on a series RL or RC circuit and observe the exponential growth of current (RL) or capacitor voltage (RC) over time, characterized by the time constant τ."
      procedure={[
        "Choose RL or RC circuit type and set component values.",
        "Close the switch (simulated below) and watch the current or voltage rise from zero toward its final steady value.",
        "Note the time constant τ = L/R (for RL) or τ = RC (for RC) — the time to reach about 63% of the final value.",
        "Compare the shape of the curve with the theoretical exponential rise formula.",
      ]}
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Circuit type</label>
          <select className="field" style={{ marginTop: 6 }} value={circuitType} onChange={e => { setCircuitType(e.target.value); setLOrC(e.target.value === "RL" ? 0.5 : 1e-6); }}>
            <option value="RL">Series RL</option>
            <option value="RC">Series RC</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            R <span className="mono" style={{ color: AMBER }}>{r} Ω</span>
          </label>
          <input type="range" min="100" max="5000" step="100" value={r} onChange={e => setR(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          {circuitType === "RL" ? (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                L <span className="mono" style={{ color: AMBER }}>{lOrC.toFixed(2)} H</span>
              </label>
              <input type="range" min="0.05" max="2" step="0.05" value={lOrC} onChange={e => setLOrC(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
            </>
          ) : (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
                C <span className="mono" style={{ color: AMBER }}>{(lOrC * 1e6).toFixed(1)} µF</span>
              </label>
              <input type="range" min="0.1e-6" max="10e-6" step="0.1e-6" value={lOrC} onChange={e => setLOrC(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
            </>
          )}
          <button className="btn-primary" style={{ width: "100%", marginTop: 16, justifyContent: "center" }} onClick={() => setSwitchClosed(s => !s)}>
            {switchClosed ? "Open switch (reset)" : "Close switch"}
          </button>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Time constant τ" value={`${(tau * 1000).toFixed(3)} ms`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>{circuitType === "RL" ? "Current" : "Capacitor voltage"} vs time</p>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={switchClosed ? curve : []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="#E4DFCE" />
                <XAxis dataKey="t" type="number" tick={{ fontSize: 12 }} label={{ value: "Time (ms)", position: "insideBottom", offset: -4, fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} label={{ value: circuitType === "RL" ? "Current (mA)" : "Voltage (V)", angle: -90, position: "insideLeft", fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke={TEAL_DARK} dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {!switchClosed && <p style={{ fontSize: 12.5, color: INK_SOFT, textAlign: "center" }}>Close the switch to see the transient response.</p>}
        </div>
        <VivaCheck
          question="At exactly t = τ (one time constant), the current in an RL circuit has reached approximately:"
          options={[["a", "37% of its final value"], ["b", "63% of its final value"], ["c", "100% of its final value"]]}
          correctKey="b"
          explanation="i(t) = (V/R)(1 − e^(−t/τ)). At t = τ, e⁻¹ ≈ 0.37, so the current has risen to 1 − 0.37 = 63% of its final steady-state value — this is the standard definition of the time constant."
        />
      </>}
    />
  );
}
