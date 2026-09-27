import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import BuretteSVG from "./chem/BuretteSVG";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V_ENDPOINT = 8.4; // hidden true titre value (mL)
const M_EDTA = 0.01; // molarity of EDTA
const V_SAMPLE = 50; // mL of hard water taken

function flaskColorAt(v) {
  const dist = V_ENDPOINT - v;
  if (dist > 1.0) return "#B23A5C"; // wine red (Ca-EBT complex)
  if (dist > 0) return `rgb(${140 + (1 - dist) * 60}, ${80 + (1 - dist) * 100}, ${170 + (1 - dist) * 60})`; // transitioning
  return "#3E6FB0"; // pure blue - free EBT
}

export default function HardnessLab({ setPage }) {
  const [volume, setVolume] = useState(0);
  const [endpointRecorded, setEndpointRecorded] = useState(false);
  const [recordedV, setRecordedV] = useState(null);

  const addDrop = (amt) => setVolume(v => Math.min(v + amt, 20));
  const reset = () => { setVolume(0); setEndpointRecorded(false); setRecordedV(null); };
  const markEndpoint = () => { setEndpointRecorded(true); setRecordedV(volume); };

  const hardness = recordedV !== null ? (recordedV * M_EDTA * 100 * 1000) / V_SAMPLE : null;
  const nearEndpoint = Math.abs(volume - V_ENDPOINT) < 1.5;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 1"
      title="Determination of hardness of water (EDTA method)"
      aim="Aim: determine the total hardness of a water sample by complexometric titration against standard EDTA solution, using Eriochrome Black T as indicator."
      procedure={[
        "Pipette 50 mL of the hard water sample into a conical flask.",
        "Add 1 mL buffer solution (pH 10) and 2-3 drops of Eriochrome Black T indicator — the solution turns wine red.",
        "Fill the burette with standard 0.01 M EDTA solution.",
        "Titrate dropwise, swirling constantly, until the color changes from wine red to a pure steel blue — this is the endpoint.",
        "Note the burette reading and calculate hardness as CaCO₃ equivalent.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Burette (0.01 M EDTA)</p>
          <BuretteSVG volume={volume} maxVolume={20} flaskColor={flaskColorAt(volume)} label="conical flask" />
        </div>
        <div className="card">
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => addDrop(0.1)}>+ 1 drop (0.1 mL)</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => addDrop(1)}>+ 1 mL</button>
          </div>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset titration</button>
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 10 }}>{nearEndpoint ? "The color is changing — slow down and add drop by drop!" : "Keep adding EDTA and watch the flask color."}</p>
          <button className="btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center", background: TEAL_DARK }} onClick={markEndpoint}>Mark this as the endpoint</button>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Burette reading" value={`${volume.toFixed(1)} mL`} />
        </div>
        {endpointRecorded && (
          <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
            <Readout label="Titre value (V1)" value={`${recordedV.toFixed(1)} mL`} />
            <Readout label="Hardness as CaCO₃" value={`${hardness.toFixed(1)} ppm`} />
          </div>
        )}
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>Hardness (ppm) = (V₁ × M × 100 × 1000) / V₂, where V₁ = EDTA used, M = molarity of EDTA, V₂ = volume of water sample.</p>
        <VivaCheck
          question="Why does the indicator change color at the endpoint?"
          options={[["a", "The water sample evaporates"], ["b", "EDTA has a stronger affinity for Ca²⁺/Mg²⁺ than the indicator does, so it displaces the indicator once all metal ions are complexed"], ["c", "The pH buffer runs out"]]}
          correctKey="b"
          explanation="Eriochrome Black T forms a weak wine-red complex with Ca²⁺/Mg²⁺. EDTA binds these ions more strongly, so once enough EDTA has been added to complex all the metal ions, it strips them from the indicator too — freeing the indicator to show its own blue color."
        />
      </>}
    />
  );
}
