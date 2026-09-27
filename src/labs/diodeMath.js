export const VT = 0.02585; // thermal voltage
export const IS = 1e-12;   // saturation current (A)
export const N = 2;        // ideality factor (silicon, visible knee)

// Solve I = Is*(exp((V - I*R)/(n*Vt)) - 1) via Newton-Raphson
export function solveDiodeCurrent(vSource, r) {
  let i = 0.001;
  for (let k = 0; k < 60; k++) {
    const vd = vSource - i * r;
    const f = IS * (Math.exp(vd / (N * VT)) - 1) - i;
    const df = IS * Math.exp(vd / (N * VT)) * (-r / (N * VT)) - 1;
    const next = i - f / df;
    if (!isFinite(next) || next < 0) { i = i / 2; continue; }
    if (Math.abs(next - i) < 1e-12) { i = next; break; }
    i = next;
  }
  return Math.max(i, 0);
}
