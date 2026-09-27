import { useState } from "react";
import DSLabShell from "./ds/DSLabShell";
import VivaCheck from "./ds/VivaCheck";
import { INK_SOFT, AMBER, TEAL_DARK } from "../constants";

const NODES = {
  A: { x: 140, y: 40 }, B: { x: 40, y: 130 }, C: { x: 240, y: 130 },
  D: { x: 40, y: 230 }, E: { x: 140, y: 280 }, F: { x: 240, y: 230 },
};
const ADJ = { A: ["B", "C"], B: ["A", "D"], C: ["A", "F"], D: ["B", "E"], E: ["D", "F"], F: ["C", "E"] };

function bfs(start) {
  const visited = [start], queue = [start], order = [start];
  while (queue.length) {
    const node = queue.shift();
    for (const next of ADJ[node]) {
      if (!visited.includes(next)) {
        visited.push(next); queue.push(next); order.push(next);
      }
    }
  }
  return order;
}

function dfs(start) {
  const visited = [], order = [];
  const visit = (node) => {
    if (visited.includes(node)) return;
    visited.push(node); order.push(node);
    for (const next of ADJ[node]) visit(next);
  };
  visit(start);
  return order;
}

export default function GraphTraversalLab({ setPage }) {
  const [start, setStart] = useState("A");
  const [order, setOrder] = useState([]);
  const [method, setMethod] = useState(null);

  const run = (which) => {
    setOrder(which === "bfs" ? bfs(start) : dfs(start));
    setMethod(which);
  };

  return (
    <DSLabShell
      setPage={setPage}
      group="Group D &middot; graphs"
      title="Graph traversal — BFS and DFS on a location network"
      aim="Aim: model a small area's locations as nodes and routes between them as edges, then find the visiting order starting from a chosen location using breadth-first search and depth-first search."
      controls={<>
        <div className="card">
          <label style={{ fontSize: 13, fontWeight: 600, display: "block" }}>Start location</label>
          <select className="field" style={{ marginTop: 6 }} value={start} onChange={e => setStart(e.target.value)}>
            {Object.keys(NODES).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
            <button className="btn-primary" onClick={() => run("bfs")}>Run BFS (adjacency list, Queue)</button>
            <button className="btn-primary" onClick={() => run("dfs")}>Run DFS (adjacency matrix idea, Stack/recursion)</button>
          </div>
        </div>
      </>}
      results={<>
        <div className="card">
          <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 10 }}>Location network</p>
          <GraphSVG order={order} />
        </div>
        {order.length > 0 && (
          <div className="card">
            <p style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 6 }}>{method === "bfs" ? "BFS" : "DFS"} visiting order</p>
            <p className="mono" style={{ fontSize: 14, color: AMBER, margin: 0 }}>{order.join(" → ")}</p>
          </div>
        )}
        <VivaCheck
          question="BFS explores a graph level by level using a Queue. DFS instead uses:"
          options={[["a", "A second graph"], ["b", "A Stack (or recursion, which uses the call stack) — diving deep before backtracking"], ["c", "No auxiliary data structure at all"]]}
          correctKey="b"
          explanation="DFS goes as deep as possible along one path before backtracking, which is naturally expressed with a Stack (explicit or via recursion's call stack) — the opposite of BFS's Queue, which explores neighbors before going deeper."
        />
      </>}
    />
  );
}

function GraphSVG({ order }) {
  const visitedSet = new Set(order);
  return (
    <svg viewBox="0 0 280 320" width="100%" height="300">
      <rect width="280" height="320" fill="#0F1D27" rx="8" />
      {Object.entries(ADJ).flatMap(([node, neighbors]) =>
        neighbors.filter(n => n > node).map(n => (
          <line key={`${node}-${n}`} x1={NODES[node].x} y1={NODES[node].y} x2={NODES[n].x} y2={NODES[n].y} stroke="#5C7686" strokeWidth="1.5" />
        ))
      )}
      {Object.entries(NODES).map(([node, pos]) => (
        <g key={node}>
          <circle cx={pos.x} cy={pos.y} r="18" fill={visitedSet.has(node) ? AMBER : "#0F1D27"} stroke={TEAL_DARK} strokeWidth="2" />
          <text x={pos.x} y={pos.y + 5} fill={visitedSet.has(node) ? "#0F1D27" : "#E4EFEC"} fontSize="13" textAnchor="middle" fontWeight="600">{node}</text>
        </g>
      ))}
    </svg>
  );
}
