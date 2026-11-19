import React, { useState } from 'react';
import { Layers, ArrowDownUp, CheckCircle, Flame, Eye, Trash2 } from 'lucide-react';

export function HeapTreeVisualizer({ maxHeap, onExtractMax, onPeekMax, onSelectPin }) {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0); // Default to root
  const heapArray = maxHeap.toArray();
  const treeNodes = maxHeap.getTreeNodes();
  const logs = maxHeap.lastOperationLogs || [];

  // SVG dimensions for tree rendering
  const svgWidth = 680;
  const svgHeight = 280;

  // Node position calculation for binary tree visualization
  // Levels: 0 (root), 1 (2 nodes), 2 (4 nodes), 3 (8 nodes)
  const getNodeCoordinates = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);

    const levelY = 40 + level * 70;
    const slotWidth = svgWidth / totalInLevel;
    const nodeX = slotWidth * positionInLevel + slotWidth / 2;

    return { x: nodeX, y: levelY, level };
  };

  const selectedNode = heapArray[selectedNodeIndex];
  const selectedParentIdx = selectedNodeIndex > 0 ? Math.floor((selectedNodeIndex - 1) / 2) : null;
  const selectedLeftIdx = 2 * selectedNodeIndex + 1 < heapArray.length ? 2 * selectedNodeIndex + 1 : null;
  const selectedRightIdx = 2 * selectedNodeIndex + 2 < heapArray.length ? 2 * selectedNodeIndex + 2 : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <h4 className="font-semibold text-slate-900 text-sm">
              Live Max-Heap Binary Tree & Array Structure
            </h4>
            <span className="px-2 py-0.5 text-xs font-mono bg-amber-100 text-amber-800 rounded-md">
              Heap Size: n = {heapArray.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Root node <strong className="text-amber-600">[0]</strong> maintains maximum engagement score. Every parent &ge; children.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPeekMax}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-2xs"
            title="Peek Root in O(1)"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            Peek Max (O(1))
          </button>
          <button
            onClick={onExtractMax}
            disabled={heapArray.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition shadow-2xs"
            title="Extract Max Root in O(log n)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Extract Max (O(log n))
          </button>
        </div>
      </div>

      {/* Main SVG Binary Tree Visualizer */}
      <div className="p-4 bg-slate-50/60 flex flex-col items-center justify-center relative overflow-x-auto">
        {heapArray.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">The Max-Heap is currently empty. Insert pins to build the tree.</p>
          </div>
        ) : (
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[680px] h-auto drop-shadow-sm select-none min-w-[500px]">
            {/* Draw parent-child edges */}
            {heapArray.map((_, idx) => {
              if (idx === 0) return null;
              const parentIdx = Math.floor((idx - 1) / 2);
              const parentPos = getNodeCoordinates(parentIdx);
              const childPos = getNodeCoordinates(idx);

              const isConnectedToSelected =
                idx === selectedNodeIndex || parentIdx === selectedNodeIndex;

              return (
                <line
                  key={`edge_${parentIdx}_${idx}`}
                  x1={parentPos.x}
                  y1={parentPos.y}
                  x2={childPos.x}
                  y2={childPos.y}
                  stroke={isConnectedToSelected ? '#f59e0b' : '#cbd5e1'}
                  strokeWidth={isConnectedToSelected ? '2.5' : '1.5'}
                  strokeDasharray={isConnectedToSelected ? 'none' : '2,2'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw nodes */}
            {heapArray.map((pin, idx) => {
              const pos = getNodeCoordinates(idx);
              const isSelected = idx === selectedNodeIndex;
              const isRoot = idx === 0;
              const isChildOfSelected = idx === selectedLeftIdx || idx === selectedRightIdx;
              const isParentOfSelected = idx === selectedParentIdx;

              let circleFill = '#ffffff';
              let strokeColor = '#94a3b8';
              let strokeWidth = '1.5';

              if (isRoot) {
                strokeColor = '#E60023';
                strokeWidth = '3';
                circleFill = '#fff1f2';
              } else if (isSelected) {
                strokeColor = '#f59e0b';
                strokeWidth = '3';
                circleFill = '#fef3c7';
              } else if (isChildOfSelected) {
                strokeColor = '#10b981';
                strokeWidth = '2';
              } else if (isParentOfSelected) {
                strokeColor = '#3b82f6';
                strokeWidth = '2';
              }

              return (
                <g
                  key={pin.id || idx}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedNodeIndex(idx);
                    if (onSelectPin) onSelectPin(pin);
                  }}
                >
                  {isRoot && (
                    <circle r="23" fill="rgba(230,0,35,0.15)" className="animate-ping" />
                  )}

                  {/* Main Circle */}
                  <circle
                    r="19"
                    fill={circleFill}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200 group-hover:scale-110 shadow-xs"
                  />

                  {/* Root crown / flame badge */}
                  {isRoot && (
                    <g transform="translate(0, -18)">
                      <rect x="-14" y="-8" width="28" height="11" rx="4" fill="#E60023" />
                      <text
                        textAnchor="middle"
                        y="0"
                        fill="#fff"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        MAX ROOT
                      </text>
                    </g>
                  )}

                  {/* Score text inside node */}
                  <text
                    y="4"
                    textAnchor="middle"
                    className="text-[11px] font-black fill-slate-900 pointer-events-none"
                  >
                    {pin.score}
                  </text>

                  {/* Array Index Tag [i] */}
                  <g transform="translate(14, 12)">
                    <rect x="-8" y="-6" width="16" height="12" rx="3" fill="#334155" />
                    <text
                      textAnchor="middle"
                      y="3"
                      fill="#fff"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {idx}
                    </text>
                  </g>

                  {/* Title Preview under node */}
                  <text
                    y="31"
                    textAnchor="middle"
                    className="text-[9px] font-medium fill-slate-600 truncate max-w-[80px] pointer-events-none"
                  >
                    {pin.title?.length > 14 ? pin.title.substring(0, 12) + '..' : pin.title}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>

      {/* Heap Array Representation (Continuous memory mapping) */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-600" />
            <h5 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              Contiguous Array Memory Representation
            </h5>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Parent(i) = &lfloor;(i-1)/2&rfloor; &nbsp;|&nbsp; Left = 2i+1 &nbsp;|&nbsp; Right = 2i+2
          </span>
        </div>

        {/* Array cell blocks */}
        <div className="flex gap-2 overflow-x-auto pb-2 pt-1">
          {heapArray.map((pin, i) => {
            const isSelected = i === selectedNodeIndex;
            const isRoot = i === 0;

            return (
              <button
                key={`arr_cell_${pin.id || i}`}
                onClick={() => setSelectedNodeIndex(i)}
                className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl border transition-all text-center min-w-[72px] ${
                  isSelected
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                    : isRoot
                    ? 'bg-rose-50 border-rose-300'
                    : 'bg-gray-50 hover:bg-slate-100 border-gray-200'
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 block mb-0.5">
                  [{i}]
                </span>
                <span className="text-sm font-black text-slate-900 block leading-tight">
                  {pin.score}
                </span>
                <span className="text-[9px] text-slate-500 truncate max-w-[62px] block mt-0.5">
                  {pin.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Inspector & Operation Trail */}
      {selectedNode && (
        <div className="p-3 bg-slate-50 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 bg-white rounded-lg border border-gray-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Node</span>
            <div className="flex items-center justify-between mt-1">
              <strong className="text-slate-900 truncate">{selectedNode.title}</strong>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono font-bold">
                Score: {selectedNode.score}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Saves: {selectedNode.saves} | Likes: {selectedNode.likes} | Comments: {selectedNode.comments}
            </p>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-gray-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tree Navigation Links</span>
            <div className="space-y-1 mt-1 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Parent index:</span>
                <span className="font-semibold text-blue-600">
                  {selectedParentIdx !== null ? `[${selectedParentIdx}] (${heapArray[selectedParentIdx]?.score})` : 'None (Root)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Left child:</span>
                <span className="font-semibold text-emerald-600">
                  {selectedLeftIdx !== null ? `[${selectedLeftIdx}] (${heapArray[selectedLeftIdx]?.score})` : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Right child:</span>
                <span className="font-semibold text-emerald-600">
                  {selectedRightIdx !== null ? `[${selectedRightIdx}] (${heapArray[selectedRightIdx]?.score})` : 'None'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-gray-200/80">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Latest Heap Log</span>
            <p className="text-[11px] text-slate-700 font-mono mt-1 leading-relaxed line-clamp-3">
              {logs.length > 0 ? logs[logs.length - 1] : 'No heap mutation yet. Insert or extract a pin to observe sifting.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
