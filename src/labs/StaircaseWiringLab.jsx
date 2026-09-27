import { useState } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import BEELabShell from "./bee/BEELabShell";
import WireCanvas, { wiresMatchRequired } from "./bee/WireCanvas";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const COMPONENTS = [
  { id: "supply", x: 20, y: 100, w: 60, h: 120, label: "Supply", pins: [{ id: "pos", dx: 60, dy: 20 }, { id: "neg", dx: 60, dy: 100 }] },
  { id: "sw1", x: 170, y: 40, w: 90, h: 90, label: "2-way switch 1 (ground floor)", pins: [{ id: "common", dx: 0, dy: 45 }, { id: "l1", dx: 90, dy: 15 }, { id: "l2", dx: 90, dy: 75 }] },
  { id: "sw2", x: 400, y: 40, w: 90, h: 90, label: "2-way switch 2 (first floor)", pins: [{ id: "l1", dx: 0, dy: 15 }, { id: "l2", dx: 0, dy: 75 }, { id: "common", dx: 90, dy: 45 }] },
  { id: "bulb", x: 560, y: 220, w: 60, h: 40, label: "Bulb", pins: [{ id: "in", dx: 0, dy: 20 }, { id: "out", dx: 60, dy: 20 }] },
];

const REQUIRED = [
  ["supply.pos", "sw1.common"],
  ["sw1.l1", "sw2.l1"],
  ["sw1.l2", "sw2.l2"],
  ["sw2.common", "bulb.in"],
  ["bulb.out", "supply.neg"],
];

export default function StaircaseWiringLab({ setPage }) {
  const [wires, setWires] = useState([]);
  const complete = wiresMatchRequired(wires, REQUIRED);
  const reset = () => setWires([]);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 2"
      title="Staircase wiring (two-way switch control)"
      aim="Aim: wire a single lamp so it can be switched ON or OFF independently from two different locations — the classic staircase wiring scheme, using two SPDT (2-way) switches."
      procedure={[
        "Connect the supply's + terminal to the common terminal of switch 1.",
        "Connect the L1 terminal of switch 1 to the L1 terminal of switch 2 (a 'strapper' wire).",
        "Connect the L2 terminal of switch 1 to the L2 terminal of switch 2 (the second strapper wire).",
        "Connect the common terminal of switch 2 to the bulb.",
        "Connect the bulb's other terminal back to the supply's − terminal.",
        "In a real installation, either switch can now turn the bulb on or off, regardless of the other switch's position — that's the whole point of two-way control.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Drag between pins to wire the staircase circuit</p>
          <WireCanvas components={COMPONENTS} wires={wires} setWires={setWires} energized={complete} width={680} height={320} />
          <BulbGlow lit={complete} />
        </div>
        <button className="btn-outline" onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Clear all wires</button>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {complete ? <CheckCircle2 size={18} color={TEAL_DARK} /> : <span style={{ width: 18 }} />}
          <span style={{ fontSize: 14, fontWeight: 600, color: complete ? TEAL_DARK : INK_SOFT }}>{complete ? "Wiring complete — this circuit supports two-way control" : "Circuit incomplete"}</span>
        </div>
        <div className="card">
          <p style={{ fontSize: 13, color: INK_SOFT, margin: 0 }}>The two wires between L1-L1 and L2-L2 are called "strappers" or "traveller wires" — they carry the signal between the two switch locations, letting either one break or complete the circuit.</p>
        </div>
        <VivaCheck
          question="Why does staircase wiring need SPDT (2-way) switches instead of ordinary single-pole switches?"
          options={[["a", "SPDT switches are cheaper"], ["b", "A single-pole switch can only break one fixed path — SPDT switches can redirect the connection between two paths, which is required for two independent control points to still work together"], ["c", "It's just a wiring convention with no functional reason"]]}
          correctKey="b"
          explanation="With ordinary switches, only one location could ever control the light reliably. SPDT switches let each switch redirect current between two traveller wires, so the ON/OFF state at the bulb depends on the relative positions of both switches — letting either one toggle the light."
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
