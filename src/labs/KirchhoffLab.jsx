import { useState, useMemo } from "react";
import { RotateCcw, CheckCircle2 } from "lucide-react";
import Readout from "../components/Readout";
import BEELabShell from "./bee/BEELabShell";
import WireCanvas, { wiresMatchRequired } from "./bee/WireCanvas";
import VivaCheck from "./bee/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const V = 12, R1 = 100, R2 = 220, R3 = 330;

const COMPONENTS = [
  { id: "supply", x: 20, y: 90, w: 50, h: 130, label: "Supply 12V", pins: [{ id: "pos", dx: 50, dy: 20 }, { id: "neg", dx: 50, dy: 110 }] },
  { id: "r1", x: 130, y: 40, w: 90, h: 34, label: "R1 = 100Ω", pins: [{ id: "in", dx: 0, dy: 17 }, { id: "out", dx: 90, dy: 17 }] },
  { id: "nodeA", x: 290, y: 130, w: 16, h: 16, label: "Node A", color: "#7C93A3", pins: [{ id: "in", dx: 0, dy: 8 }, { id: "out2", dx: 16, dy: 3 }, { id: "out3", dx: 16, dy: 13 }] },
  { id: "r2", x: 400, y: 40, w: 90, h: 34, label: "R2 = 220Ω", pins: [{ id: "in", dx: 0, dy: 17 }, { id: "out", dx: 90, dy: 17 }] },
  { id: "r3", x: 400, y: 220, w: 90, h: 34, label: "R3 = 330Ω", pins: [{ id: "in", dx: 0, dy: 17 }, { id: "out", dx: 90, dy: 17 }] },
  { id: "nodeB", x: 560, y: 130, w: 16, h: 16, label: "Node B", color: "#7C93A3", pins: [{ id: "in2", dx: 0, dy: 3 }, { id: "in3", dx: 0, dy: 13 }, { id: "out", dx: 16, dy: 8 }] },
];

const REQUIRED = [
  ["supply.pos", "r1.in"],
  ["r1.out", "nodeA.in"],
  ["nodeA.out2", "r2.in"],
  ["nodeA.out3", "r3.in"],
  ["r2.out", "nodeB.in2"],
  ["r3.out", "nodeB.in3"],
  ["nodeB.out", "supply.neg"],
];

export default function KirchhoffLab({ setPage }) {
  const [wires, setWires] = useState([]);
  const complete = wiresMatchRequired(wires, REQUIRED);
  const reset = () => setWires([]);

  const { i1, i2, i3 } = useMemo(() => {
    const rp = (R2 * R3) / (R2 + R3);
    const i1 = V / (R1 + rp);
    const vParallel = i1 * rp;
    const i2 = vParallel / R2;
    const i3 = vParallel / R3;
    return { i1, i2, i3 };
  }, []);

  return (
    <BEELabShell
      setPage={setPage}
      unit="experiment 3"
      title="Verification of Kirchhoff's laws"
      aim="Aim: wire R1 in series with a parallel combination of R2 and R3, then verify Kirchhoff's Current Law (current into node A equals current out) and compute branch currents."
      procedure={[
        "Connect the supply's + terminal through R1 to node A.",
        "From node A, branch out to both R2 and R3 in parallel.",
        "Bring both branches back together at node B, and return to the supply's − terminal.",
        "Once wired, the calculated branch currents appear on the right — check that I1 = I2 + I3 at node A (KCL).",
      ]}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Wire R1 in series, then R2 and R3 in parallel</p>
          <WireCanvas components={COMPONENTS} wires={wires} setWires={setWires} energized={complete} width={680} height={280} />
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
              <Readout label="I1 (through R1)" value={`${i1.toFixed(3)} A`} />
              <Readout label="I2 (through R2)" value={`${i2.toFixed(3)} A`} />
              <Readout label="I3 (through R3)" value={`${i3.toFixed(3)} A`} />
            </div>
            <div className="card">
              <p style={{ fontSize: 13, margin: 0 }}>KCL check at node A: I2 + I3 = <span className="mono">{(i2 + i3).toFixed(3)} A</span>, I1 = <span className="mono">{i1.toFixed(3)} A</span> — {Math.abs(i1 - (i2 + i3)) < 0.001 ? "✓ matches" : "mismatch"}</p>
            </div>
          </>
        )}
        <VivaCheck
          question="Kirchhoff's Current Law (KCL) states that at any node:"
          options={[["a", "Voltage is the same on all branches"], ["b", "The sum of currents entering equals the sum of currents leaving"], ["c", "Resistance is always zero"]]}
          correctKey="b"
          explanation="KCL is a statement of charge conservation — no charge can accumulate at a node, so whatever current flows in must flow back out, split across however many branches leave that node."
        />
      </>}
    />
  );
}
