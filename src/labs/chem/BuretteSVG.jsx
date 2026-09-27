export default function BuretteSVG({ volume, maxVolume = 50, flaskColor = "#E8DCC8", label }) {
  const fillFrac = Math.max(0, 1 - volume / maxVolume);
  const buretteTopY = 10, buretteBottomY = 110, buretteH = buretteBottomY - buretteTopY;
  const liquidTop = buretteTopY + buretteH * (1 - fillFrac);
  return (
    <svg viewBox="0 0 160 220" width="100%" height="210">
      <rect width="160" height="220" fill="#0F1D27" rx="8" />
      {/* burette tube */}
      <rect x="72" y={buretteTopY} width="16" height={buretteH} fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <rect x="73" y={liquidTop} width="14" height={buretteBottomY - liquidTop} fill="#D9891F" opacity="0.6" />
      {/* stopcock */}
      <line x1="80" y1={buretteBottomY} x2="80" y2={buretteBottomY + 15} stroke="#5C7686" strokeWidth="2" />
      {/* flask */}
      <path d="M 60 165 L 60 190 L 40 215 L 120 215 L 100 190 L 100 165 Z" fill="none" stroke="#5C7686" strokeWidth="1.5" />
      <path d="M 62 195 L 45 213 L 115 213 L 98 195 Z" fill={flaskColor} opacity="0.85" />
      <text x="20" y="20" fill="#7C93A3" fontSize="9">{volume.toFixed(1)} mL</text>
      {label && <text x="10" y="205" fill="#7C93A3" fontSize="9">{label}</text>}
    </svg>
  );
}
