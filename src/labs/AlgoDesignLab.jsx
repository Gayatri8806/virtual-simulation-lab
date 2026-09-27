import { useState } from "react";
import { INK_SOFT, TEAL_DARK, AMBER } from "../constants";
import PyLabShell from "./py/PyLabShell";
import VivaCheck from "./py/VivaCheck";

const TABS = ["Algorithm", "Pseudocode", "Flowchart"];

export default function AlgoDesignLab({ setPage }) {
  const [tab, setTab] = useState("Algorithm");

  return (
    <PyLabShell
      setPage={setPage}
      unit="unit I"
      title="Program design tools: algorithm, flowchart, pseudocode"
      aim="Aim: for the problem 'find the largest of three numbers', express the same logic as an algorithm, as pseudocode, and as a flowchart, and see how each represents identical logic differently."
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Problem</p>
          <p style={{ fontSize: 14, color: INK_SOFT }}>Given three numbers a, b, c — find and display the largest one.</p>
        </div>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>View as</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TABS.map(t => (
              <button key={t} className="btn-outline" style={{ borderColor: tab === t ? TEAL_DARK : "#C9C2AE", color: tab === t ? TEAL_DARK : undefined, textAlign: "left" }} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
        </div>
      </>}
      results={<>
        <div className="card">
          {tab === "Algorithm" && (
            <ol style={{ fontSize: 14, lineHeight: 2, color: INK_SOFT, paddingLeft: 20 }}>
              <li>Start</li>
              <li>Read three numbers a, b, c</li>
              <li>If a &gt; b and a &gt; c, then largest = a</li>
              <li>Else if b &gt; c, then largest = b</li>
              <li>Else, largest = c</li>
              <li>Display largest</li>
              <li>Stop</li>
            </ol>
          )}
          {tab === "Pseudocode" && (
            <pre className="mono" style={{ background: "#0F1D27", color: "#E4EFEC", borderRadius: 8, padding: "14px 16px", fontSize: 13, margin: 0 }}>
{`BEGIN
  READ a, b, c
  IF a > b AND a > c THEN
    largest <- a
  ELSE IF b > c THEN
    largest <- b
  ELSE
    largest <- c
  ENDIF
  PRINT largest
END`}
            </pre>
          )}
          {tab === "Flowchart" && <FlowchartSVG />}
        </div>
        <VivaCheck
          question="Which of these is language-independent and readable by non-programmers too?"
          options={[["a", "Python source code"], ["b", "Algorithm / flowchart"], ["c", "Compiled bytecode"]]}
          correctKey="b"
          explanation="Algorithms and flowcharts describe logic in plain steps or diagrams, independent of any specific programming language — that's exactly why we design in them before writing code."
        />
      </>}
    />
  );
}

function FlowchartSVG() {
  const box = { fill: "#0F1D27", stroke: "#2E6F63" };
  return (
    <svg viewBox="0 0 320 460" width="100%" height="440">
      <ellipse cx="160" cy="25" rx="55" ry="20" style={box} strokeWidth="1.5" />
      <text x="160" y="30" fill={AMBER} fontSize="12" textAnchor="middle">Start</text>
      <line x1="160" y1="45" x2="160" y2="70" stroke="#5C7686" />
      <rect x="90" y="70" width="140" height="34" style={box} strokeWidth="1.5" />
      <text x="160" y="91" fill="#E4EFEC" fontSize="11" textAnchor="middle">Read a, b, c</text>
      <line x1="160" y1="104" x2="160" y2="130" stroke="#5C7686" />
      <polygon points="160,130 230,170 160,210 90,170" style={box} strokeWidth="1.5" />
      <text x="160" y="165" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">a &gt; b AND</text>
      <text x="160" y="178" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">a &gt; c ?</text>
      <text x="235" y="167" fill={AMBER} fontSize="10">Yes</text>
      <text x="168" y="222" fill={AMBER} fontSize="10">No</text>
      <line x1="230" y1="170" x2="270" y2="170" stroke="#5C7686" />
      <rect x="270" y="153" width="45" height="34" style={box} strokeWidth="1.5" />
      <text x="292" y="174" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">a</text>
      <line x1="160" y1="210" x2="160" y2="235" stroke="#5C7686" />
      <polygon points="160,235 220,270 160,305 100,270" style={box} strokeWidth="1.5" />
      <text x="160" y="274" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">b &gt; c ?</text>
      <text x="225" y="267" fill={AMBER} fontSize="10">Yes</text>
      <text x="168" y="317" fill={AMBER} fontSize="10">No</text>
      <line x1="220" y1="270" x2="270" y2="270" stroke="#5C7686" />
      <rect x="270" y="253" width="45" height="34" style={box} strokeWidth="1.5" />
      <text x="292" y="274" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">b</text>
      <line x1="160" y1="305" x2="160" y2="330" stroke="#5C7686" />
      <rect x="130" y="330" width="60" height="34" style={box} strokeWidth="1.5" />
      <text x="160" y="351" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">c</text>
      <line x1="160" y1="364" x2="160" y2="385" stroke="#5C7686" />
      <line x1="292" y1="187" x2="292" y2="400" stroke="#5C7686" />
      <line x1="292" y1="253" x2="292" y2="253" stroke="#5C7686" />
      <line x1="160" y1="385" x2="160" y2="400" stroke="#5C7686" />
      <line x1="160" y1="400" x2="292" y2="400" stroke="#5C7686" />
      <rect x="105" y="400" width="110" height="34" style={box} strokeWidth="1.5" />
      <text x="160" y="421" fill="#E4EFEC" fontSize="10.5" textAnchor="middle">Print largest</text>
      <line x1="160" y1="434" x2="160" y2="445" stroke="#5C7686" />
      <ellipse cx="160" cy="445" rx="45" ry="15" style={box} strokeWidth="1.5" />
      <text x="160" y="449" fill={AMBER} fontSize="11" textAnchor="middle">Stop</text>
    </svg>
  );
}
