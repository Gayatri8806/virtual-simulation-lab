import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Readout from "../components/Readout";
import ChemLabShell from "./chem/ChemLabShell";
import VivaCheck from "./chem/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const W0 = 1.000; // g, initial sample weight
const MOISTURE_LOSS = 0.023;
const VOLATILE_LOSS = 0.281;
const ASH_REMAINING = 0.114;

const STEPS = [
  { key: "start", label: "Weigh empty crucible + coal sample", weight: W0 },
  { key: "moisture", label: "Heat at 105-110°C for 1 hour (moisture)", weight: W0 - MOISTURE_LOSS },
  { key: "volatile", label: "Heat covered at 950°C for 7 minutes (volatile matter)", weight: W0 - MOISTURE_LOSS - VOLATILE_LOSS },
  { key: "ash", label: "Burn uncovered at 700-750°C to constant weight (ash)", weight: ASH_REMAINING },
];

export default function CoalProximateLab({ setPage }) {
  const [stepIdx, setStepIdx] = useState(0);

  const currentWeight = STEPS[stepIdx].weight;
  const advance = () => setStepIdx(i => Math.min(i + 1, STEPS.length - 1));
  const reset = () => setStepIdx(0);

  const moisturePct = (MOISTURE_LOSS / W0) * 100;
  const volatilePct = (VOLATILE_LOSS / W0) * 100;
  const ashPct = (ASH_REMAINING / W0) * 100;
  const fixedCarbonPct = 100 - moisturePct - volatilePct - ashPct;

  const done = stepIdx === STEPS.length - 1;

  return (
    <ChemLabShell
      setPage={setPage}
      unit="experiment 7"
      title="Proximate analysis of coal"
      aim="Aim: determine the percentage of moisture, volatile matter, ash, and fixed carbon in a coal sample through a sequence of controlled heating steps."
      procedure={[
        "Weigh a clean, dry crucible with about 1 g of powdered coal sample.",
        "Heat at 105-110°C for one hour to drive off moisture, then reweigh — the loss gives % moisture.",
        "Heat the covered crucible at 950°C for 7 minutes to drive off volatile matter, then reweigh — the loss gives % volatile matter.",
        "Heat the uncovered crucible at 700-750°C until the weight is constant — the residue is the ash.",
        "Fixed carbon is found by difference: 100 − (%moisture + %volatile matter + %ash).",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Current step</p>
          <p style={{ fontSize: 14, color: INK_SOFT, marginBottom: 14 }}>{STEPS[stepIdx].label}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={advance} disabled={done}>{done ? "All steps complete" : "Perform this step"}</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={15} /></button>
          </div>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "center" }}>
          <Readout label="Crucible + sample weight" value={`${currentWeight.toFixed(3)} g`} />
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Weight log</p>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead><tr style={{ textAlign: "left", color: INK_SOFT }}><th style={{ padding: "4px 6px" }}>Step</th><th style={{ padding: "4px 6px" }}>Weight (g)</th></tr></thead>
            <tbody>
              {STEPS.slice(0, stepIdx + 1).map((s, i) => (
                <tr key={s.key} className="mono" style={{ borderTop: "1px solid #E4DFCE" }}><td style={{ padding: "5px 6px" }}>{s.label}</td><td style={{ padding: "5px 6px" }}>{s.weight.toFixed(3)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        {done && (
          <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 10 }}>
            <Readout label="Moisture" value={`${moisturePct.toFixed(1)}%`} />
            <Readout label="Volatile matter" value={`${volatilePct.toFixed(1)}%`} />
            <Readout label="Ash" value={`${ashPct.toFixed(1)}%`} />
            <Readout label="Fixed carbon" value={`${fixedCarbonPct.toFixed(1)}%`} />
          </div>
        )}
        <VivaCheck
          question="Why must the crucible be covered during the volatile matter step, but uncovered during ashing?"
          options={[["a", "It's arbitrary lab tradition"], ["b", "Covering excludes air so volatiles escape without burning; uncovering allows air in so the remaining carbon can fully combust to ash"], ["c", "Covering speeds up heating"]]}
          correctKey="b"
          explanation="In the volatile matter step, the cover limits oxygen so gases are driven off without combusting — measuring true volatile content. In the ashing step, air must reach the sample so the fixed carbon burns away completely, leaving only inorganic ash."
        />
      </>}
    />
  );
}
