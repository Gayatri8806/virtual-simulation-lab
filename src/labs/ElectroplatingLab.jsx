import { useState } from "react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const F = 96500; // Faraday's constant, C/mol
const METALS = {
  copper: { name: "Copper", M: 63.5, n: 2, color: "#C97A4A" },
  zinc: { name: "Zinc", M: 65.4, n: 2, color: "#B8C2C8" },
};

export default function ElectroplatingLab({ setPage }) {
  const [metal, setMetal] = useState("copper");
  const [current, setCurrent] = useState(0.5);
  const [timeMin, setTimeMin] = useState(20);

  const { M, n, color } = METALS[metal];
  const timeSec = timeMin * 60;
  const massDeposited = (current * timeSec * M) / (n * F);
  const platingThickness = Math.min(6, massDeposited * 40); // purely visual scale

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 9"
      title="Electroplating of a metal onto an iron plate"
      aim="Aim: electroplate copper (or zinc) onto a clean iron plate by electrolysis, and use Faraday's first law to calculate the mass of metal deposited from the current and time."
      procedure={[
        "Clean the iron plate (cathode) thoroughly to remove grease and oxide layer.",
        "Set up the electrolytic cell with the metal salt solution (e.g. CuSO₄ for copper) and a pure metal anode.",
        "Connect the iron plate as cathode and the metal rod as anode to a DC power supply.",
        "Pass a measured current for a measured time.",
        "Remove, wash, dry, and weigh the plate to find the mass gained — compare with the theoretical mass from Faraday's law.",
      ]}
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Metal to deposit</label>
          <select className="field" style={{ marginTop: 6 }} value={metal} onChange={e => setMetal(e.target.value)}>
            <option value="copper">Copper (Cu²⁺, M=63.5)</option>
            <option value="zinc">Zinc (Zn²⁺, M=65.4)</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            Current <span className="mono" style={{ color: AMBER }}>{current.toFixed(2)} A</span>
          </label>
          <input type="range" min="0.1" max="2" step="0.05" value={current} onChange={e => setCurrent(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            Time <span className="mono" style={{ color: AMBER }}>{timeMin} min</span>
          </label>
          <input type="range" min="1" max="60" step="1" value={timeMin} onChange={e => setTimeMin(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Plated iron sheet</p>
          <PlateSVG color={color} thickness={platingThickness} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Charge passed (Q = It)" value={`${(current * timeSec).toFixed(0)} C`} />
          <Readout label="Mass deposited" value={`${massDeposited.toFixed(4)} g`} />
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>m = (I × t × M) / (n × F), where n is the number of electrons transferred per metal ion and F = 96500 C/mol.</p>
        <VivaCheck
          question="If you double the current while keeping time constant, the mass deposited:"
          options={[["a", "Stays the same"], ["b", "Doubles"], ["c", "Quadruples"]]}
          correctKey="b"
          explanation="Faraday's first law states mass deposited is directly proportional to the charge passed (Q = It). Doubling the current doubles Q, and since m ∝ Q, the mass deposited also doubles."
        />
      </>}
    />
  );
}

function PlateSVG({ color, thickness }) {
  return (
    <svg viewBox="0 0 200 160" width="100%" height="150">
      <rect width="200" height="160" fill="#0F1D27" rx="8" />
      <rect x="60" y="30" width="80" height="100" fill="#8A93A0" />
      <rect x={60 - thickness} y={30 - thickness} width={80 + thickness * 2} height={100 + thickness * 2} fill={color} opacity="0.55" />
      <rect x="60" y="30" width="80" height="100" fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <text x="55" y="145" fill="#7C93A3" fontSize="9">iron plate (cathode)</text>
    </svg>
  );
}
