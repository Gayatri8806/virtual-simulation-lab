export default function PixelGrid({ pixels, gridSize = 20, cell = 14, highlight = [] }) {
  const size = gridSize * cell;
  const highlightSet = new Set(highlight.map(([x, y]) => `${x},${y}`));
  const pixelSet = new Set(pixels.map(([x, y]) => `${x},${y}`));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={Math.min(360, size)} style={{ background: "#0F1D27", borderRadius: 8 }}>
      {Array.from({ length: gridSize + 1 }).map((_, i) => (
        <g key={i}>
          <line x1={i * cell} y1={0} x2={i * cell} y2={size} stroke="#1E3441" strokeWidth="1" />
          <line x1={0} y1={i * cell} x2={size} y2={i * cell} stroke="#1E3441" strokeWidth="1" />
        </g>
      ))}
      {Array.from(pixelSet).map(key => {
        const [x, y] = key.split(",").map(Number);
        const isHi = highlightSet.has(key);
        return (
          <rect
            key={key}
            x={x * cell} y={(gridSize - 1 - y) * cell}
            width={cell} height={cell}
            fill={isHi ? "#E24B3D" : "#D9891F"}
          />
        );
      })}
    </svg>
  );
}
