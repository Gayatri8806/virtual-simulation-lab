import { useState } from "react";
import Readout from "../components/Readout";
import PhysicsLabShell from "./physics/PhysicsLabShell";
import VivaCheck from "./physics/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const LINES_PER_CM = 5000; // grating: 5000 lines/cm
const D_NM = 1e7 / LINES_PER_CM; // grating spacing in nm
const LAMBDA_TRUE_NM = 650; // hidden true laser wavelength (red)

export default function DiffractionGratingLab({ setPage }) {
  const [order, setOrder] = useState(1);
  const [theta, setTheta] = useState(18.8);

  const thetaRad = (theta * Math.PI) / 180;
  const lambdaCalc = (D_NM * Math.sin(thetaRad)) / order;
  const thetaTrueDeg = (Math.asin((order * LAMBDA_TRUE_NM) / D_NM) * 180) / Math.PI;
  const error = Math.abs(theta - thetaTrueDeg);

  return (
    <PhysicsLabShell
      setPage={setPage}
      unit="unit III &middot; wave optics"
      title="Diffraction grating — wavelength of laser light"
      aim={`Aim: using a grating with ${LINES_PER_CM.toLocaleString()} lines/cm, locate the diffraction maxima for order n and use d·sinθ = nλ to determine the wavelength of the laser.`}
      controls={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Diffraction pattern</p>
          <PatternSVG order={order} theta={theta} thetaTrue={thetaTrueDeg} />
        </div>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Order n</label>
          <select className="field" style={{ marginTop: 6 }} value={order} onChange={e => setOrder(Number(e.target.value))}>
            <option value={1}>1st order</option>
            <option value={2}>2nd order</option>
          </select>
          <label style={{ fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            Spectrometer angle θ <span className="mono" style={{ color: AMBER }}>{theta.toFixed(2)}°</span>
          </label>
          <input type="range" min="0" max="60" step="0.1" value={theta} onChange={e => setTheta(Number(e.target.value))} style={{ width: "100%", marginTop: 8 }} />
          <p style={{ fontSize: 12, color: INK_SOFT, marginTop: 8 }}>Find the angle where the diffracted spot (right panel) lines up brightest for this order — that's your maximum.</p>
        </div>
      </>}
      results={<>
        <div className="card" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 12 }}>
          <Readout label="Grating spacing d" value={`${D_NM.toFixed(1)} nm`} />
          <Readout label="λ calculated" value={`${lambdaCalc.toFixed(1)} nm`} />
        </div>
        <p style={{ fontSize: 12, color: INK_SOFT, textAlign: "center" }}>{error < 0.3 ? "Right at the maximum — great measurement!" : `Off by ${error.toFixed(1)}° from the true maximum — fine-tune θ.`}</p>
        <VivaCheck
          question="If you use the 2nd order maximum instead of the 1st, for the same wavelength, θ will be:"
          options={[["a", "Smaller"], ["b", "Larger"], ["c", "Exactly the same"]]}
          correctKey="b"
          explanation="From d sinθ = nλ, a larger n needs a larger sinθ (for the same λ and d) to satisfy the equation — so higher orders diffract at wider angles."
        />
      </>}
    />
  );
}

function PatternSVG({ order, theta, thetaTrue }) {
  const cx = 130, cy = 100, radius = 90;
  const rad = (theta * Math.PI) / 180;
  const spotX = cx + radius * Math.sin(rad);
  const spotY = cy - radius * Math.cos(rad);
  const closeness = Math.max(0, 1 - Math.abs(theta - thetaTrue) / 10);
  return (
    <svg viewBox="0 0 260 200" width="100%" height="180">
      <rect width="260" height="200" fill="#0F1D27" rx="8" />
      <line x1={cx} y1={cy} x2={cx} y2={cy - radius} stroke="#5C7686" strokeWidth="1" strokeDasharray="3 3" />
      <line x1={cx} y1={cy} x2={spotX} y2={spotY} stroke="#7C93A3" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="4" fill="#7C93A3" />
      <circle cx={spotX} cy={spotY} r={4 + closeness * 6} fill={`rgba(217,137,31,${0.25 + closeness * 0.7})`} stroke="#E24B3D" strokeWidth="1" />
      <text x="10" y="20" fill="#7C93A3" fontSize="10">order n = {order}</text>
    </svg>
  );
}
