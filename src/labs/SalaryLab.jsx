import { useState } from "react";
import Readout from "../components/Readout";
import PyLabShell from "./py/PyLabShell";
import PyShell from "./py/PyShell";
import VivaCheck from "./py/VivaCheck";

export default function SalaryLab({ setPage }) {
  const [basic, setBasic] = useState(30000);
  const [hraPct, setHraPct] = useState(40);
  const [daPct, setDaPct] = useState(20);
  const [deductionPct, setDeductionPct] = useState(10);
  const [log, setLog] = useState([]);

  const hra = (basic * hraPct) / 100;
  const da = (basic * daPct) / 100;
  const gross = basic + hra + da;
  const deduction = (gross * deductionPct) / 100;
  const net = gross - deduction;

  const record = () => {
    setLog(prev => [...prev, {
      code: `basic = ${basic}\nhra = basic * ${hraPct} / 100\nda = basic * ${daPct} / 100\ngross = basic + hra + da\nnet = gross - gross * ${deductionPct} / 100\nprint("Gross:", gross, "Net:", net)`,
      out: `Gross: ${gross.toFixed(2)} Net: ${net.toFixed(2)}`,
    }]);
  };

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit I"
      title="Employee gross & net salary calculator"
      aim="Aim: given basic pay and standard allowance/deduction percentages, compute gross salary (basic + HRA + DA) and net salary (gross − deductions)."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Basic pay (₹)</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={basic} onChange={e => setBasic(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>HRA %</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={hraPct} onChange={e => setHraPct(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>DA %</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={daPct} onChange={e => setDaPct(Number(e.target.value))} />
          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginTop: 14 }}>Deduction %</label>
          <input className="field" style={{ marginTop: 6 }} type="number" value={deductionPct} onChange={e => setDeductionPct(Number(e.target.value))} />
          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 16 }} onClick={record}>Run</button>
        </div>
        <div className="card" style={{ display: "flex", justifyContent: "space-around" }}>
          <Readout label="Gross" value={`₹${gross.toFixed(2)}`} />
          <Readout label="Net" value={`₹${net.toFixed(2)}`} />
        </div>
      </>}
      results={<>
        <PyShell log={log.length ? log : [{ code: "# set values and click Run", out: null }]} />
        <VivaCheck
          question="In this program, net salary is calculated as:"
          options={[["a", "basic pay only"], ["b", "gross salary minus deductions"], ["c", "HRA plus DA only"]]}
          correctKey="b"
          explanation="Net salary = gross salary − deductions, where gross salary itself is basic pay plus allowances like HRA and DA."
        />
      </>}
    />
  );
}
