import { useState } from "react";
import { RotateCcw } from "lucide-react";
import DELDLabShell from "./deld/DELDLabShell";
import VivaCheck from "./deld/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

export default function ShiftRegisterLab({ setPage }) {
  const [mode, setMode] = useState("SISO");
  const [bits, setBits] = useState([0, 0, 0, 0]);
  const [serialIn, setSerialIn] = useState(1);
  const [parallelIn, setParallelIn] = useState([1, 0, 1, 1]);
  const [serialOut, setSerialOut] = useState([]);

  const shift = () => {
    if (mode === "PIPO") {
      setBits([...parallelIn]);
      return;
    }
    const input = (mode === "SISO" || mode === "SIPO") ? serialIn : 0;
    const shiftedOut = bits[3];
    setBits(prev => [input, prev[0], prev[1], prev[2]]);
    if (mode === "SISO" || mode === "PISO") {
      setSerialOut(prev => [...prev, shiftedOut].slice(-6));
    }
  };

  const reset = () => { setBits([0, 0, 0, 0]); setSerialOut([]); };

  return (
    <DELDLabShell
      setPage={setPage}
      unit="Unit II"
      title="Shift registers: SISO, SIPO, PISO, PIPO"
      aim="Aim: shift a 4-bit register left-to-right one clock pulse at a time, in each of the four standard input/output modes — serial or parallel in, serial or parallel out."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Mode</label>
          <select className="field" style={{ marginTop: 6 }} value={mode} onChange={e => setMode(e.target.value)}>
            <option value="SISO">SISO — serial in, serial out</option>
            <option value="SIPO">SIPO — serial in, parallel out</option>
            <option value="PISO">PISO — parallel in, serial out</option>
            <option value="PIPO">PIPO — parallel in, parallel out</option>
          </select>
          {(mode === "SISO" || mode === "SIPO") && (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Next serial input bit</label>
              <button onClick={() => setSerialIn(1 - serialIn)} className="mono" style={{ width: 44, height: 44, marginTop: 6, borderRadius: 8, border: `1.5px solid ${TEAL_DARK}`, background: serialIn ? AMBER : "#0F1D27", color: serialIn ? "#0F1D27" : "#5C7686", fontWeight: 700, cursor: "pointer" }}>{serialIn}</button>
            </>
          )}
          {(mode === "PISO" || mode === "PIPO") && (
            <>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Parallel load value</label>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                {parallelIn.map((v, i) => (
                  <button key={i} onClick={() => setParallelIn(prev => prev.map((x, idx) => idx === i ? 1 - x : x))} className="mono" style={{ width: 34, height: 34, borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: v ? AMBER : "#0F1D27", color: v ? "#0F1D27" : "#5C7686", fontWeight: 700, cursor: "pointer" }}>{v}</button>
                ))}
              </div>
            </>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button className="btn-primary" style={{ flex: 1 }} onClick={shift}>{mode === "PIPO" ? "Load (parallel)" : "Clock pulse (shift)"}</button>
            <button className="btn-outline" onClick={reset}><RotateCcw size={14} /></button>
          </div>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Register contents (left = newest)</p>
          <div style={{ display: "flex", gap: 8 }}>
            {bits.map((b, i) => (
              <div key={i} className="mono" style={{ width: 40, height: 40, lineHeight: "40px", textAlign: "center", borderRadius: 6, border: `1.5px solid ${TEAL_DARK}`, background: "#0F1D27", color: AMBER, fontWeight: 700 }}>{b}</div>
            ))}
          </div>
        </div>
        {(mode === "SISO" || mode === "PISO") && (
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>Serial output stream</p>
            {serialOut.length === 0 ? <p style={{ fontSize: 12.5, color: INK_SOFT }}>No bits shifted out yet.</p> : (
              <p className="mono" style={{ fontSize: 15, color: TEAL_DARK }}>{serialOut.join(" → ")}</p>
            )}
          </div>
        )}
        <VivaCheck
          question="What's the key structural difference between PISO and SIPO?"
          options={[["a", "PISO loads all bits simultaneously then shifts them out one at a time; SIPO shifts bits in one at a time then all are available at once", ], ["b", "They are functionally identical"], ["c", "PISO only works with even numbers of bits"]]}
          correctKey="a"
          explanation="PISO (parallel-in, serial-out) is used to convert parallel data into a serial stream — load once, shift out bit by bit. SIPO does the reverse — collect a serial stream bit by bit, then read all bits at once in parallel."
        />
      </>}
    />
  );
}
