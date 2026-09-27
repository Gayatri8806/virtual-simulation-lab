import { useState } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import BEELabShell from "./bee/BEELabShell";
import WireCanvas, { wiresMatchRequired } from "./bee/WireCanvas";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const COMPONENTS = [
  { id: "supply", x: 40, y: 60, w: 60, h: 140, label: "Supply", pins: [{ id: "pos", dx: 60, dy: 20, name: "+" }, { id: "neg", dx: 60, dy: 180, name: "-" }] },
  { id: "switch", x: 280, y: 60, w: 90, h: 40, label: "Switch", pins: [{ id: "in", dx: 0, dy: 20, name: "in" }, { id: "out", dx: 90, dy: 20, name: "out" }] },
  { id: "bulb", x: 280, y: 200, w: 90, h: 40, label: "Bulb", pins: [{ id: "in", dx: 0, dy: 20, name: "in" }, { id: "out", dx: 90, dy: 20, name: "out" }] },
];

const REQUIRED = [
  ["supply.pos", "switch.in"],
  ["switch.out", "bulb.in"],
  ["bulb.out", "supply.neg"],
];

export default function SimpleWiringLab({ setPage }) {
  const [wires, setWires] = useState([]);
  const complete = wiresMatchRequired(wires, REQUIRED);
  const reset = () => setWires([]);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 1"
      title="Study of simple house wiring"
      aim="Aim: build a basic one-lamp, one-switch circuit by dragging connections between the supply, switch, and bulb — exactly as you would wire a single room light at home."
      procedure={[
        "Identify the two terminals of the supply (+ and −), the two terminals of the switch, and the two terminals of the bulb.",
        "Drag from the supply's + terminal to one terminal of the switch.",
        "Drag from the switch's other terminal to one terminal of the bulb.",
        "Drag from the bulb's other terminal back to the supply's − terminal, completing the loop.",
        "Once wired correctly, the bulb should light up — click any wire to remove it and re-wire if needed.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Drag from one pin to another to wire the circuit</p>
          <WireCanvas components={COMPONENTS} wires={wires} setWires={setWires} energized={complete} />
          <BulbGlow lit={complete} />
        </div>
        <button className="btn-outline" onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Clear all wires</button>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {complete ? <CheckCircle2 size={18} color={TEAL_DARK} /> : <span style={{ width: 18 }} />}
          <span style={{ fontSize: 14, fontWeight: 600, color: complete ? TEAL_DARK : INK_SOFT }}>{complete ? "Circuit complete — bulb lit!" : "Circuit incomplete"}</span>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: INK_SOFT, margin: 0 }}>This is the simplest wiring scheme: a single-pole switch in series with the load, controlled from one location only.</p>
        </div>
        <VivaCheck
          question="In this simple wiring scheme, the switch is always connected:"
          options={[["a", "In parallel with the bulb"], ["b", "In series with the bulb, in the live/phase wire"], ["c", "Directly across the supply, bypassing the bulb"]]}
          correctKey="b"
          explanation="The switch must be in series with the load (bulb) so that opening it breaks the current path completely, safely disconnecting the bulb from the supply."
        />
      </>}
    />
  );
}

function BulbGlow({ lit }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
      <div style={{ width: 26, height: 26, borderRadius: "50%", background: lit ? AMBER : "#2A3B47", boxShadow: lit ? `0 0 18px 6px ${AMBER}88` : "none", transition: "all .3s" }} />
    </div>
  );
}
