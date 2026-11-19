import React, { useState } from 'react';
import { UserCheck, Share2, Compass, Play, RefreshCw, Info } from 'lucide-react';

export function GraphVisualizer({ graph, currentUserId, onSelectUser, selectedUserId }) {
  const [activeBfsResult, setActiveBfsResult] = useState(null);
  const [isBfsRunning, setIsBfsRunning] = useState(false);
  const [bfsStep, setBfsStep] = useState(0);

  const vertices = graph.getAllVertices();
  const adjacencyList = graph.getAdjacencyListObject();

  // Calculate circular layout coordinates for SVG
  const width = 640;
  const height = 460;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 170;

  const nodePositions = {};
  vertices.forEach((v, idx) => {
    const angle = (2 * Math.PI * idx) / vertices.length - Math.PI / 2;
    nodePositions[v.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      angle
    };
  });

  // Collect all directed edges
  const edges = [];
  for (const [fromId, neighbors] of Object.entries(adjacencyList)) {
    neighbors.forEach(toId => {
      if (nodePositions[fromId] && nodePositions[toId]) {
        edges.push({
          from: fromId,
          to: toId,
          isFromSelected: fromId === selectedUserId,
          isToSelected: toId === selectedUserId,
          isTraversed: activeBfsResult?.edgesTraversed.some(
            e => e.from === fromId && e.to === toId
          )
        });
      }
    });
  }

  // Run BFS with animated step exploration
  const handleStartBFS = (startId) => {
    setIsBfsRunning(true);
    const result = graph.bfs(startId);
    setActiveBfsResult(result);
    setBfsStep(result.visitedOrder.length);
  };

  const handleResetBFS = () => {
    setActiveBfsResult(null);
    setIsBfsRunning(false);
  };

  const selectedUserData = vertices.find(v => v.id === selectedUserId);
  const selectedFollowing = selectedUserId ? (adjacencyList[selectedUserId] || []) : [];
  const selectedFollowers = selectedUserId ? graph.getFollowers(selectedUserId) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h4 className="font-semibold text-slate-800 text-sm">Live Directed Graph Visualizer</h4>
            <span className="px-2 py-0.5 text-xs font-mono bg-slate-200 text-slate-700 rounded-md">
              V = {graph.getVertexCount()}, E = {graph.getEdgeCount()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Edges indicate directed follows: <strong className="text-red-600">A &rarr; B</strong> (A follows B; B does not imply A).
          </p>
        </div>

        {/* BFS Controls */}
        <div className="flex items-center gap-2">
          {activeBfsResult ? (
            <button
              onClick={handleResetBFS}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Traversal
            </button>
          ) : (
            <button
              onClick={() => handleStartBFS(selectedUserId || currentUserId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition shadow-sm"
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Run BFS from {selectedUserId ? vertices.find(v => v.id === selectedUserId)?.name?.split(' ')[0] : 'You'}
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas and Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* SVG Graph View */}
        <div className="lg:col-span-8 p-3 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[560px] h-auto drop-shadow-sm select-none">
            <defs>
              {/* Arrow markers */}
              <marker
                id="arrow-default"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#cbd5e1" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#E60023" />
              </marker>
              <marker
                id="arrow-incoming"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
              </marker>
              <marker
                id="arrow-bfs"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, idx) => {
              const start = nodePositions[edge.from];
              const end = nodePositions[edge.to];
              if (!start || !end) return null;

              // Arc curve to distinguish bidirectional edges (A->B and B->A)
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              // Slight perpendicular curve
              const curveFactor = 16;
              const midX = (start.x + end.x) / 2 - (dy / dist) * curveFactor;
              const midY = (start.y + end.y) / 2 + (dx / dist) * curveFactor;

              let stroke = '#cbd5e1';
              let strokeWidth = '1.5';
              let marker = 'url(#arrow-default)';

              if (edge.isTraversed) {
                stroke = '#10b981';
                strokeWidth = '2.5';
                marker = 'url(#arrow-bfs)';
              } else if (edge.isFromSelected) {
                stroke = '#E60023'; // Outgoing from selected user (red)
                strokeWidth = '2.5';
                marker = 'url(#arrow-active)';
              } else if (edge.isToSelected) {
                stroke = '#3b82f6'; // Incoming to selected user (blue)
                strokeWidth = '1.8';
                marker = 'url(#arrow-incoming)';
              }

              return (
                <path
                  key={`edge_${edge.from}_${edge.to}_${idx}`}
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  markerEnd={marker}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Nodes */}
            {vertices.map(vertex => {
              const pos = nodePositions[vertex.id];
              if (!pos) return null;

              const isSelected = vertex.id === selectedUserId;
              const isCurrent = vertex.id === currentUserId;
              const isFollowedBySelected = selectedFollowing.includes(vertex.id);
              const isFollowerOfSelected = selectedFollowers.includes(vertex.id);

              let nodeBorder = 'stroke-slate-300';
              let nodeFill = '#ffffff';

              if (isSelected) {
                nodeBorder = 'stroke-red-600 stroke-[3]';
              } else if (isCurrent) {
                nodeBorder = 'stroke-purple-600 stroke-[2.5]';
              } else if (isFollowedBySelected) {
                nodeBorder = 'stroke-red-400 stroke-[2]';
              } else if (isFollowerOfSelected) {
                nodeBorder = 'stroke-blue-400 stroke-[2]';
              }

              // BFS level styling
              const bfsLevel = activeBfsResult?.levels[vertex.id];
              const isVisitedInBfs = bfsLevel !== undefined;

              return (
                <g
                  key={vertex.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => onSelectUser(vertex.id)}
                >
                  {/* Subtle glow if selected */}
                  {isSelected && (
                    <circle r="26" fill="rgba(230, 0, 35, 0.15)" className="animate-ping" />
                  )}

                  {/* Outer circle / border */}
                  <circle
                    r="22"
                    fill={isVisitedInBfs ? '#ecfdf5' : nodeFill}
                    className={`${nodeBorder} transition-all duration-200 group-hover:scale-110 shadow-sm`}
                  />

                  {/* Clip path for user avatar */}
                  <clipPath id={`avatar-clip-${vertex.id}`}>
                    <circle r="19" />
                  </clipPath>

                  <image
                    href={vertex.avatar}
                    x="-19"
                    y="-19"
                    width="38"
                    height="38"
                    clipPath={`url(#avatar-clip-${vertex.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* BFS Level badge */}
                  {isVisitedInBfs && (
                    <g transform="translate(14, -14)">
                      <circle r="9" fill="#10b981" />
                      <text
                        textAnchor="middle"
                        dy="3"
                        fill="#fff"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        L{bfsLevel}
                      </text>
                    </g>
                  )}

                  {/* Label under node */}
                  <text
                    y="32"
                    textAnchor="middle"
                    className="text-[11px] font-semibold fill-slate-800 drop-shadow-sm pointer-events-none"
                  >
                    {vertex.name.split(' ')[0]}
                    {isCurrent ? ' (You)' : ''}
                  </text>
                  <text
                    y="43"
                    textAnchor="middle"
                    className="text-[9px] fill-slate-500 font-mono pointer-events-none"
                  >
                    {vertex.handle}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Interactive Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 px-3 py-1.5 bg-white/90 backdrop-blur rounded-full border border-gray-200 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span>Outgoing (Following)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Incoming (Followers)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>BFS Traversal</span>
            </div>
          </div>
        </div>

        {/* Real-time Adjacency List & Node Inspector */}
        <div className="lg:col-span-4 p-4 border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h5 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-red-600" />
                Adjacency List (Hash Set)
              </h5>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                O(1) Edge Lookup
              </span>
            </div>

            {/* Selected User Details */}
            {selectedUserData ? (
              <div className="mb-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={selectedUserData.avatar}
                    alt={selectedUserData.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30"
                  />
                  <div>
                    <h6 className="font-bold text-slate-900 text-xs">{selectedUserData.name}</h6>
                    <p className="text-[10px] font-mono text-slate-500">{selectedUserData.handle}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-2xs">
                    <span className="text-slate-400 block text-[10px]">Out-Degree</span>
                    <strong className="text-red-600 font-bold">{selectedFollowing.length}</strong>
                    <span className="text-[10px] text-slate-500 block">following</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-gray-100 shadow-2xs">
                    <span className="text-slate-400 block text-[10px]">In-Degree</span>
                    <strong className="text-blue-600 font-bold">{selectedFollowers.length}</strong>
                    <span className="text-[10px] text-slate-500 block">followers</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 mb-3 italic">
                Click any node on the graph to inspect its adjacency entry.
              </p>
            )}

            {/* Adjacency List Dictionary View */}
            <div className="max-h-56 overflow-y-auto space-y-1.5 text-xs font-mono pr-1">
              {Object.entries(adjacencyList).map(([userId, neighbors]) => {
                const isSelected = userId === selectedUserId;
                const userObj = vertices.find(v => v.id === userId);
                return (
                  <div
                    key={userId}
                    onClick={() => onSelectUser(userId)}
                    className={`p-2 rounded-lg cursor-pointer transition border text-left ${
                      isSelected
                        ? 'bg-red-50/80 border-red-300 text-slate-900'
                        : 'bg-gray-50 hover:bg-slate-100 border-gray-200/60 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {userObj?.handle || userId}
                      </span>
                      <span className="text-[10px] text-slate-500 font-sans">
                        {neighbors.length} outgoing
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">
                      &rarr; [
                      {neighbors.length === 0 ? (
                        <span className="text-slate-400 italic">none</span>
                      ) : (
                        neighbors.map(nId => {
                          const nUser = vertices.find(v => v.id === nId);
                          return nUser ? `${nUser.handle} ` : `${nId} `;
                        })
                      )}
                      ]
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* BFS Exploration Log (if active) */}
          {activeBfsResult && (
            <div className="mt-3 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs">
              <span className="font-bold text-emerald-800 block text-[11px] mb-1">
                BFS Traversal Order (O(V + E)):
              </span>
              <div className="flex flex-wrap gap-1">
                {activeBfsResult.visitedOrder.map((nodeId, i) => {
                  const nodeObj = vertices.find(v => v.id === nodeId);
                  const lvl = activeBfsResult.levels[nodeId];
                  return (
                    <span
                      key={nodeId}
                      className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-mono flex items-center gap-1"
                    >
                      {i + 1}. {nodeObj?.name?.split(' ')[0]} (L{lvl})
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
