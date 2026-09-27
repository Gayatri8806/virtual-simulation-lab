import { useState, useMemo } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import WireCanvas, { wiresMatchRequired } from "./bee/WireCanvas";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V1 = 10, V2 = 6, R1 = 100, R2 = 150, R = 220; // R is the shared/load resistor

const COMPONENTS = [
  { id: "v1", x: 20, y: 30, w: 50, h: 90, label: "V1 = 10V", pins: [{ id: "pos", dx: 50, dy: 15 }, { id: "neg", dx: 50, dy: 75 }] },
  { id: "r1", x: 130, y: 30, w: 90, h: 34, label: "R1 = 100Ω", pins: [{ id: "in", dx: 0, dy: 17 }, { id: "out", dx: 90, dy: 17 }] },
  { id: "node", x: 300, y: 130, w: 16, h: 16, label: "Node", color: "#7C93A3", pins: [{ id: "a", dx: 8, dy: 0 }, { id: "b", dx: 0, dy: 8 }, { id: "c", dx: 16, dy: 8 }, { id: "d", dx: 8, dy: 16 }] },
  { id: "v2", x: 20, y: 180, w: 50, h: 90, label: "V2 = 6V", pins: [{ id: "pos", dx: 50, dy: 15 }, { id: "neg", dx: 50, dy: 75 }] },
  { id: "r2", x: 130, y: 180, w: 90, h: 34, label: "R2 = 150Ω", pins: [{ id: "in", dx: 0, dy: 17 }, { id: "out", dx: 90, dy: 17 }] },
  { id: "rload", x: 440, y: 100, w: 34, h: 90, label: "R = 220Ω", pins: [{ id: "in", dx: 17, dy: 0 }, { id: "out", dx: 17, dy: 90 }] },
  { id: "ground", x: 440, y: 230, w: 16, h: 16, label: "Return", color: "#7C93A3", pins: [{ id: "a", dx: 8, dy: 0 }, { id: "b", dx: 0, dy: 8 }, { id: "c", dx: 16, dy: 8 }] },
];

const REQUIRED = [
  ["v1.pos", "r1.in"],
  ["r1.out", "node.a"],
  ["v2.pos", "r2.in"],
  ["r2.out", "node.b"],
  ["node.c", "rload.in"],
  ["rload.out", "ground.a"],
  ["v1.neg", "ground.b"],
  ["v2.neg", "ground.c"],
];

// Superposition: contribution of V1 alone (V2 shorted) and V2 alone (V1 shorted), summed.
function contributionFrom(vSource, rSeries, rOther, rLoad) {
  const rParallel = (rOther * rLoad) / (rOther + rLoad);
  const totalR = rSeries + rParallel;
  const iSource = vSource / totalR;
  const vAtNode = iSource * rParallel;
  const iLoad = vAtNode / rLoad;
  return iLoad;
}

export default function SuperpositionLab({ setPage }) {
  const [wires, setWires] = useState([]);
  const complete = wiresMatchRequired(wires, REQUIRED);
  const reset = () => setWires([]);

  const { iFromV1, iFromV2, iTotal, iCombined } = useMemo(() => {
    const iFromV1 = contributionFrom(V1, R1, R2, R);
    const iFromV2 = contributionFrom(V2, R2, R1, R);
    const iTotal = iFromV1 + iFromV2;
    // Direct combined calculation using Millman's theorem for cross-check
    const iCombined = (V1 / R1 + V2 / R2) / (1 / R1 + 1 / R2 + 1 / R) * (1 / R);
    return { iFromV1, iFromV2, iTotal, iCombined };
  }, []);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 4"
      title="Verification of the superposition theorem"
      aim="Aim: wire a circuit with two independent voltage sources feeding a common load resistor, then verify that the total current through the load equals the sum of the currents caused by each source acting alone."
      procedure={[
        "Connect V1 through R1 to the common node.",
        "Connect V2 through R2 to the same common node.",
        "Connect the node through the load resistor R back to the common return.",
        "Return both V1 and V2's negative terminals to that same return point.",
        "Once wired, compare the load current computed with both sources together against the sum of each source's individual contribution.",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Wire both sources into the shared load</p>
          <WireCanvas components={COMPONENTS} wires={wires} setWires={setWires} energized={complete} width={680} height={300} />
        </div>
        <button className="btn-outline" onClick={reset}><RotateCcw size={14} style={{ marginRight: 6 }} />Clear all wires</button>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {complete ? <CheckCircle2 size={18} color={TEAL_DARK} /> : <span style={{ width: 18 }} />}
          <span style={{ fontSize: 14, fontWeight: 600, color: complete ? TEAL_DARK : INK_SOFT }}>{complete ? "Circuit complete" : "Circuit incomplete"}</span>
        </div>
        {complete && (
          <>
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Readout label="Load current from V1 alone" value={`${(iFromV1 * 1000).toFixed(2)} mA`} />
              <Readout label="Load current from V2 alone" value={`${(iFromV2 * 1000).toFixed(2)} mA`} />
              <Readout label="Sum of individual contributions" value={`${(iTotal * 1000).toFixed(2)} mA`} />
            </div>
            <div className="card">
              <p style={{ fontSize: 13, margin: 0 }}>Directly computed load current with both sources active: <span className="mono">{(iCombined * 1000).toFixed(2)} mA</span> — {Math.abs(iTotal - iCombined) < 0.0005 ? "✓ matches the sum above" : "mismatch"}</p>
            </div>
          </>
        )}
        <VivaCheck
          question="When finding the contribution of one source alone, what do you do with the other independent voltage source?"
          options={[["a", "Remove it and leave that branch open"], ["b", "Replace it with a short circuit (zero volts), keeping its internal resistance if any"], ["c", "Double its value"]]}
          correctKey="b"
          explanation="Superposition requires deactivating all other independent sources one at a time — for a voltage source, that means replacing it with a short circuit (0V), not removing the branch entirely, since its wire path (and any internal resistance) still matters."
        />
      </>}
    />
  );
}
