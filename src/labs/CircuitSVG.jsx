import { AMBER } from "../constants";

export default function CircuitSVG({ vSource, iMa }) {
  const glow = Math.min(1, iMa / 15);
  return (
    <svg viewBox="0 0 260 130" width="100%" height="120">
      <rect x="0" y="0" width="260" height="130" fill="#0F1D27" rx="6" />
      <text x="14" y="20" fill="#7C93A3" fontSize="10" fontFamily="IBM Plex Mono, monospace">Vs = {vSource.toFixed(2)} V</text>
      <line x1="20" y1="65" x2="60" y2="65" stroke="#5C7686" strokeWidth="2" />
      <circle cx="20" cy="65" r="3" fill="#5C7686" />
      <text x="6" y="69" fill="#7C93A3" fontSize="9">+</text>
      <line x1="60" y1="30" x2="60" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="52" y1="40" x2="68" y2="40" stroke="#5C7686" strokeWidth="2" />
      <line x1="55" y1="48" x2="65" y2="48" stroke="#5C7686" strokeWidth="2" />
      <line x1="60" y1="30" x2="140" y2="30" stroke="#5C7686" strokeWidth="2" />
      <rect x="140" y="20" width="40" height="20" fill="none" stroke="#5C7686" strokeWidth="2" />
      <text x="145" y="17" fill="#7C93A3" fontSize="9">R</text>
      <line x1="180" y1="30" x2="220" y2="30" stroke="#5C7686" strokeWidth="2" />
      <line x1="220" y1="30" x2="220" y2="55" stroke="#5C7686" strokeWidth="2" />
      <polygon points="210,55 230,55 220,75" fill={`rgba(217,137,31,${0.3 + glow * 0.7})`} stroke={AMBER} strokeWidth="1.5" />
      <line x1="210" y1="75" x2="230" y2="75" stroke={AMBER} strokeWidth="2" />
      <line x1="220" y1="75" x2="220" y2="100" stroke="#5C7686" strokeWidth="2" />
      <line x1="220" y1="100" x2="60" y2="100" stroke="#5C7686" strokeWidth="2" />
      <circle cx="220" cy="65" r={3 + glow * 3} fill={`rgba(217,137,31,${0.15 + glow * 0.5})`} />
    </svg>
  );
}
