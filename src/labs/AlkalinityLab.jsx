import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import BuretteSVG from "./chem/BuretteSVG";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, TEAL_DARK } from "../constants";

const P_ENDPOINT = 3.2; // hidden true phenolphthalein endpoint (mL)
const M_ENDPOINT_EXTRA = 6.8; // additional mL for methyl orange endpoint after P
const N_HCL = 0.02;
const V_SAMPLE = 100;

export default function AlkalinityLab({ setPage }) {
  const [stage, setStage] = useState("phenol"); // phenol -> methylorange -> done
  const [volume, setVolume] = useState(0);
  const [pVolume, setPVolume] = useState(null);
  const [mVolume, setMVolume] = useState(null);

  const totalEndpoint = P_ENDPOINT + M_ENDPOINT_EXTRA;
  const addDrop = (amt) => setVolume(v => Math.min(v + amt, 20));
  const reset = () => { setVolume(0); setStage("phenol"); setPVolume(null); setMVolume(null); };

  const flaskColor = stage === "phenol"
    ? (volume < P_ENDPOINT - 0.5 ? "#D96BB0" : volume < P_ENDPOINT ? "#E8B8D4" : "#EDE7DC")
    : (volume < totalEndpoint - 0.5 ? "#F2C94C" : volume < totalEndpoint ? "#F0935A" : "#E0664A");

  const markPhenolEndpoint = () => { setPVolume(volume); setStage("methylorange"); };
  const markTotalEndpoint = () => { setMVolume(volume - pVolume); setStage("done"); };

  const pAlkalinity = pVolume !== null ? (pVolume * N_HCL * 50000) / V_SAMPLE : null;
  const totalAlkalinity = pVolume !== null && mVolume !== null ? ((pVolume + mVolume) * N_HCL * 50000) / V_SAMPLE : null;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 2"
      title="Determination of alkalinity of water"
      aim="Aim: determine phenolphthalein alkalinity and total alkalinity of a water sample by titrating against standard HCl, using phenolphthalein and then methyl orange as indicators."
      procedure={[
        "Pipette 100 mL of the water sample into a conical flask.",
        "Add 2-3 drops of phenolphthalein — the solution turns pink if phenolphthalein alkalinity is present.",
        "Titrate with standard 0.02 N HCl until the pink color just disappears. Note this reading as P.",
        "Add 2-3 drops of methyl orange to the same flask — it turns yellow.",
        "Continue titrating with HCl until the color changes from yellow to orange-pink. Note the additional volume as M.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 12 }}>Burette (0.02 N HCl)</p>
          <BuretteSVG volume={volume} maxVolume={20} flaskColor={flaskColor} label={stage === "phenol" ? "phenolphthalein stage" : "methyl orange stage"} />
        </div>
        <div className="card">
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => addDrop(0.1)} disabled={stage === "done"}>+ 1 drop</button>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => addDrop(1)} disabled={stage === "done"}>+ 1 mL</button>
          </div>
          <button className="btn-outline" style={{ width: "100%", marginTop: 10 }} onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Reset titration</button>
          {stage === "phenol" && <button className="btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center", background: TEAL_DARK }} onClick={markPhenolEndpoint}>Mark phenolphthalein endpoint (P)</button>}
          {stage === "methylorange" && <button className="btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center", background: TEAL_DARK }} onClick={markTotalEndpoint}>Mark methyl orange endpoint (M)</button>}
          {stage === "done" && <p style={{ fontSize: 12.5, color: INK_SOFT, marginTop: 10 }}>Both endpoints recorded. Reset to try again.</p>}
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Burette reading" value={`${volume.toFixed(1)} mL`} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
          <Readout label="P (phenolphthalein)" value={pVolume !== null ? `${pVolume.toFixed(1)} mL` : "—"} />
          <Readout label="M (methyl orange, extra)" value={mVolume !== null ? `${mVolume.toFixed(1)} mL` : "—"} />
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
          <Readout label="Phenolphthalein alkalinity" value={pAlkalinity !== null ? `${pAlkalinity.toFixed(1)} ppm` : "—"} />
          <Readout label="Total alkalinity" value={totalAlkalinity !== null ? `${totalAlkalinity.toFixed(1)} ppm` : "—"} />
        </div>
        <VivaCheck
          question="If P = 0 (no color change with phenolphthalein at all), the water sample contains:"
          options={[["a", "Only hydroxide alkalinity"], ["b", "Only bicarbonate alkalinity, no carbonate or hydroxide"], ["c", "No alkalinity of any kind"]]}
          correctKey="b"
          explanation="Phenolphthalein alkalinity (P) responds to hydroxide and half the carbonate present. If P = 0, there's no hydroxide or carbonate — any alkalinity present must be entirely bicarbonate, detected only by methyl orange (M)."
        />
      </>}
    />
  );
}
