import { useState, useRef } from "react";
import { AMBER, TEAL_DARK } from "../../constants";

const CANVAS_W = 640;
const CANVAS_H = 320;

// components: [{ id, x, y, w, h, label, color, pins: [{ id, dx, dy, name }] }]
// wires: [[compId.pinId, compId.pinId], ...]
export default function WireCanvas({ components, wires, setWires, energized = false, width = CANVAS_W, height = CANVAS_H }) {
  const svgRef = useRef(null);
  const [dragFrom, setDragFrom] = useState(null);
  const [cursor, setCursor] = useState(null);

  const findPin = (compId, pinId) => {
    const comp = components.find(c => c.id === compId);
    if (!comp) return null;
    const pin = comp.pins.find(p => p.id === pinId);
    if (!pin) return null;
    return { x: comp.x + pin.dx, y: comp.y + pin.dy };
  };

  const toSvgCoords = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * width,
      y: ((clientY - rect.top) / rect.height) * height,
    };
  };

  const startWire = (compId, pinId) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    const pos = findPin(compId, pinId);
    setDragFrom({ key: `${compId}.${pinId}`, ...pos });
    setCursor(pos);
  };

  const handleMove = (e) => {
    if (!dragFrom) return;
    const point = e.touches ? e.touches[0] : e;
    setCursor(toSvgCoords(point.clientX, point.clientY));
  };

  const endWire = (compId, pinId) => (e) => {
    e.stopPropagation();
    if (dragFrom) {
      const targetKey = `${compId}.${pinId}`;
      if (targetKey !== dragFrom.key) {
        setWires(prev => {
          const exists = prev.some(([a, b]) => (a === dragFrom.key && b === targetKey) || (a === targetKey && b === dragFrom.key));
          if (exists) return prev;
          return [...prev, [dragFrom.key, targetKey]];
        });
      }
    }
    setDragFrom(null);
  };

  const cancelDrag = () => setDragFrom(null);

  const removeWire = (idx) => setWires(prev => prev.filter((_, i) => i !== idx));

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height * 0.75}
      style={{ background: "#0F1D27", borderRadius: 8, touchAction: "none" }}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseUp={cancelDrag}
      onTouchEnd={cancelDrag}
      onMouseLeave={cancelDrag}
    >
      {/* completed wires */}
      {wires.map(([a, b], idx) => {
        const [compA, pinA] = a.split(".");
        const [compB, pinB] = b.split(".");
        const p1 = findPin(compA, pinA), p2 = findPin(compB, pinB);
        if (!p1 || !p2) return null;
        return (
          <line
            key={idx}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={energized ? AMBER : "#5C9E8E"}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ cursor: "pointer" }}
            onClick={() => removeWire(idx)}
          />
        );
      })}
      {/* in-progress wire */}
      {dragFrom && cursor && (
        <line x1={dragFrom.x} y1={dragFrom.y} x2={cursor.x} y2={cursor.y} stroke="#7C93A3" strokeWidth="2" strokeDasharray="4 3" />
      )}
      {/* components */}
      {components.map(comp => (
        <g key={comp.id}>
          <rect x={comp.x} y={comp.y} width={comp.w} height={comp.h} fill="none" stroke={comp.color || "#5C7686"} strokeWidth="2" rx="4" />
          <text x={comp.x + comp.w / 2} y={comp.y - 8} fill="#B8C2C8" fontSize="11" textAnchor="middle">{comp.label}</text>
          {comp.pins.map(pin => (
            <circle
              key={pin.id}
              cx={comp.x + pin.dx}
              cy={comp.y + pin.dy}
              r="6"
              fill={dragFrom && dragFrom.key === `${comp.id}.${pin.id}` ? AMBER : "#0F1D27"}
              stroke={TEAL_DARK}
              strokeWidth="2"
              style={{ cursor: "crosshair" }}
              onMouseDown={startWire(comp.id, pin.id)}
              onTouchStart={startWire(comp.id, pin.id)}
              onMouseUp={endWire(comp.id, pin.id)}
              onTouchEnd={endWire(comp.id, pin.id)}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function connectionKey(compId, pinId) {
  return `${compId}.${pinId}`;
}

export function wiresMatchRequired(wires, required) {
  // required: array of [keyA, keyB]. Order-independent, must all be present (extras allowed).
  return required.every(([a, b]) =>
    wires.some(([wa, wb]) => (wa === a && wb === b) || (wa === b && wb === a))
  );
}
