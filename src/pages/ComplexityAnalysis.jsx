import React, { useState } from 'react';
import {
  LineChart,
  Table,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

export function ComplexityAnalysis() {
  const [activeCurveScale, setActiveCurveScale] = useState(50); // Elements N for asymptotic curve chart

  // Generate growth rate data points for visual curve comparison
  // O(1), O(log n), O(n), O(n log n), O(n^2)
  const nValues = [1, 5, 10, 20, 30, 40, 50, 64];

  const growthData = nValues.map(n => ({
    n,
    o1: 1,
    oLogN: Math.round(Math.log2(n || 1) * 10) / 10,
    oN: n,
    oKLogN: Math.round(5 * Math.log2(n || 1) * 10) / 10, // K = 5
    oN2: Math.min(n * n, 500)
  }));

  const variables = [
    {
      sym: 'n',
      name: 'Feed Candidate Count',
      domain: 'Max-Heap',
      desc: 'Total active pins under consideration for feed ranking in the Max-Heap priority queue.'
    },
    {
      sym: 'V',
      name: 'Vertices Count',
      domain: 'Directed Graph',
      desc: 'Total registered user accounts and visual discovery creators in the network.'
    },
    {
      sym: 'E',
      name: 'Directed Edges Count',
      domain: 'Directed Graph',
      desc: 'Total follow relationships $(u \to v)$ across the entire platform.'
    },
    {
      sym: 'd',
      name: 'Degree (Following/Followers)',
      domain: 'Directed Graph',
      desc: 'Number of accounts a specific user follows ($d_{out}$) or has following them ($d_{in}$).'
    },
    {
      sym: 'm',
      name: 'Queue Event Capacity',
      domain: 'FIFO Queue',
      desc: 'Number of active notifications or message packets queued in memory awaiting consumption.'
    },
    {
      sym: 's',
      name: 'Stack History Depth',
      domain: 'LIFO Stack',
      desc: 'Number of undoable image editing commands or snapshot deltas preserved in memory.'
    },
    {
      sym: 'K',
      name: 'Top-K Result Size',
      domain: 'Max-Heap Top-K',
      desc: 'Number of highest-ranked visual pins requested to populate the initial viewport (e.g., $K=20$).'
    }
  ];

  const comparativeTable = [
    {
      ds: 'Directed Graph (Adj. List + Hash Sets)',
      feature: 'Follow & Board Graph',
      insert: 'O(1) avg',
      delete: 'O(1) avg',
      search: 'O(1) avg',
      traversal: 'O(V + E)',
      space: 'O(V + E)',
      badge: 'Graph'
    },
    {
      ds: 'Max-Heap (Binary Heap Array)',
      feature: 'Personalized Feed Ranking',
      insert: 'O(log n)',
      delete: 'O(log n) [Extract]',
      search: 'O(1) [Peek Root]',
      traversal: 'O(K log n) [Top-K]',
      space: 'O(n)',
      badge: 'Heap'
    },
    {
      ds: 'FIFO Queue (Linked Front/Rear)',
      feature: 'Notification & Event Stream',
      insert: 'O(1) [Enqueue]',
      delete: 'O(1) [Dequeue]',
      search: 'O(1) [Peek Front]',
      traversal: 'O(m)',
      space: 'O(m)',
      badge: 'Queue'
    },
    {
      ds: 'LIFO Stack (Dual Array Stack)',
      feature: 'Pin Studio Undo/Redo',
      insert: 'O(1) [Push]',
      delete: 'O(1) [Pop]',
      search: 'O(1) [Peek Top]',
      traversal: 'O(s)',
      space: 'O(s)',
      badge: 'Stack'
    }
  ];

  const alternatives = [
    {
      feature: 'Follow Network',
      chosen: 'Adjacency List + Hash Sets',
      alternative: 'Adjacency Matrix',
      chosenComplexity: 'O(V + E) space, O(1) follow lookup',
      altComplexity: 'O(V²) space, O(V) neighbor lookup',
      verdict: 'Superior Space & Sparsity',
      explanation:
        'With millions of users where average follow count $d \ll V$, a matrix consumes terabytes of zero entries. Adjacency lists store only active edges.'
    },
    {
      feature: 'Follower Verification',
      chosen: 'Hash Set per Vertex',
      alternative: 'Plain Unsorted Array / Linked List',
      chosenComplexity: 'O(1) average lookup',
      altComplexity: 'O(d) linear scan lookup',
      verdict: 'Immediate Asymmetric Lookups',
      explanation:
        'Querying whether Alice follows Bob executes in constant time with hash sets, vs traversing an entire list of followings.'
    },
    {
      feature: 'Feed Candidate Ranking',
      chosen: 'Binary Max-Heap',
      alternative: 'Fully Sorted Array (QuickSort/MergeSort)',
      chosenComplexity: 'O(n) build, O(K log n) Top-K extraction',
      altComplexity: 'O(n log n) full sort, O(n) insert',
      verdict: 'Dramatic Top-K Savings',
      explanation:
        'When retrieving $K=20$ pins from $n=10,000$ candidates, Max-Heap does not sort the remaining 9,980 pins, saving thousands of cpu cycles.'
    },
    {
      feature: 'Notification Dispatch',
      chosen: 'FIFO Queue (Head/Tail Pointers)',
      alternative: 'Array Shifting (Array.shift())',
      chosenComplexity: 'O(1) enqueue, O(1) dequeue',
      altComplexity: 'O(m) memory re-indexing on shift',
      verdict: 'Zero Memory Copying',
      explanation:
        'Native JS array shifting re-indexes all $m-1$ subsequent items in memory on every dequeue. Pointer-based queues eliminate this bottleneck.'
    },
    {
      feature: 'Pin Studio Undo/Redo',
      chosen: 'Command Pattern Dual Stack',
      alternative: 'Re-rendering Entire History Tree',
      chosenComplexity: 'O(1) push, O(1) pop, O(s) space',
      altComplexity: 'O(s × Render Cost) time',
      verdict: 'Instantaneous UI Feedback',
      explanation:
        'Stack preserves differential snapshots or inverse operational commands, enabling constant-time state restoration.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Algorithm & Complexity Analysis
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
            Asymptotic Time & Space Bounds
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Formal Big-O evaluations comparing chosen Pinterest data structures against conventional alternatives.
        </p>
      </div>

      {/* A. Asymptotic Master Table */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Table className="w-4 h-4 text-red-600" />
            A. Comparative Operation & Space Complexity Table
          </h3>
          <span className="text-xs font-mono text-slate-400">Activity 2 Research Report Matrix</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                <th className="py-3 px-3">Data Structure</th>
                <th className="py-3 px-3">Target Pinterest Module</th>
                <th className="py-3 px-3">Insertion</th>
                <th className="py-3 px-3">Deletion / Extract</th>
                <th className="py-3 px-3">Search / Peek</th>
                <th className="py-3 px-3">Traversal / Top-K</th>
                <th className="py-3 px-3">Space Bounds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
              {comparativeTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-3 font-sans font-bold text-slate-900">
                    {row.ds}
                  </td>
                  <td className="py-3.5 px-3 font-sans text-slate-600">
                    {row.feature}
                  </td>
                  <td className="py-3.5 px-3 text-emerald-600 font-semibold">{row.insert}</td>
                  <td className="py-3.5 px-3 text-blue-600 font-semibold">{row.delete}</td>
                  <td className="py-3.5 px-3 text-purple-600 font-semibold">{row.search}</td>
                  <td className="py-3.5 px-3 text-amber-600 font-semibold">{row.traversal}</td>
                  <td className="py-3.5 px-3 text-slate-900 font-bold">{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B. Visual Asymptotic Growth Chart (SVG) */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              B. Visual Comparison of Asymptotic Growth Curves
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Notice how $O(1)$, $O(\log n)$, and $O(K \log n)$ stay near the bottom as $n$ increases, while $O(n^2)$ explodes exponentially.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-mono text-emerald-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> O(1)
            </span>
            <span className="flex items-center gap-1 font-mono text-blue-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> O(log n)
            </span>
            <span className="flex items-center gap-1 font-mono text-amber-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> O(K log n)
            </span>
            <span className="flex items-center gap-1 font-mono text-purple-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> O(n)
            </span>
            <span className="flex items-center gap-1 font-mono text-rose-600 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> O(n²)
            </span>
          </div>
        </div>

        {/* SVG Curve Plot */}
        <div className="p-4 bg-slate-950 rounded-2xl overflow-x-auto text-white">
          <svg viewBox="0 0 680 260" className="w-full min-w-[550px] h-auto select-none font-mono text-[10px]">
            {/* Grid Lines */}
            {[50, 100, 150, 200].map(y => (
              <line key={y} x1="50" y1={y} x2="650" y2={y} stroke="#1e293b" strokeDasharray="3,3" />
            ))}
            <line x1="50" y1="20" x2="50" y2="220" stroke="#475569" strokeWidth="1.5" />
            <line x1="50" y1="220" x2="650" y2="220" stroke="#475569" strokeWidth="1.5" />

            {/* Labels */}
            <text x="25" y="25" fill="#94a3b8" textAnchor="middle">Operations</text>
            <text x="630" y="240" fill="#94a3b8" textAnchor="middle">Input Size (n)</text>

            {/* X-axis ticks */}
            {nValues.map((val, i) => {
              const x = 50 + (i * 600) / (nValues.length - 1);
              return (
                <g key={val} transform={`translate(${x}, 225)`}>
                  <line y2="5" stroke="#475569" />
                  <text y="15" textAnchor="middle" fill="#64748b">{val}</text>
                </g>
              );
            })}

            {/* Curves */}
            {/* O(1) Constant (Green) */}
            <path
              d={`M 50 216 L 650 216`}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />

            {/* O(log n) (Blue) */}
            <path
              d={nValues.map((val, i) => {
                const x = 50 + (i * 600) / (nValues.length - 1);
                const logVal = Math.log2(val || 1);
                const y = 220 - logVal * 12;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />

            {/* O(K log n) (Amber, K=5) */}
            <path
              d={nValues.map((val, i) => {
                const x = 50 + (i * 600) / (nValues.length - 1);
                const logVal = 5 * Math.log2(val || 1);
                const y = 220 - Math.min(logVal * 5, 200);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />

            {/* O(n) Linear (Purple) */}
            <path
              d={nValues.map((val, i) => {
                const x = 50 + (i * 600) / (nValues.length - 1);
                const y = 220 - (val / 64) * 160;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              strokeDasharray="4,2"
            />

            {/* O(n^2) Quadratic (Red) */}
            <path
              d={`M 50 220 Q 200 210, 320 25`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Curve Legend inside plot */}
            <text x="610" y="210" fill="#10b981" fontWeight="bold">O(1)</text>
            <text x="610" y="145" fill="#3b82f6" fontWeight="bold">O(log n)</text>
            <text x="610" y="80" fill="#f59e0b" fontWeight="bold">O(K log n)</text>
            <text x="540" y="50" fill="#a855f7" fontWeight="bold">O(n)</text>
            <text x="325" y="25" fill="#ef4444" fontWeight="bold">O(n²)</text>
          </svg>
        </div>
      </div>

      {/* C. Variable Glossary */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5 mb-8">
        <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-600" />
          C. Mathematical Notation & Parameter Definitions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {variables.map((v) => (
            <div key={v.sym} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-base font-extrabold text-red-600 px-1.5 py-0.5 bg-red-50 rounded border border-red-200">
                  {v.sym}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {v.domain}
                </span>
              </div>
              <strong className="text-slate-800 block text-xs mb-0.5">{v.name}</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* D. Comprehensive Alternatives Considered */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            D. Architectural Alternatives Considered & Trade-Off Proofs
          </h3>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            5 Design Decisions
          </span>
        </div>

        <div className="space-y-4">
          {alternatives.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  {item.feature}: {item.chosen} <span className="text-slate-400 font-normal">vs</span> {item.alternative}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full w-fit">
                  {item.verdict}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 text-xs font-mono">
                <div className="p-2 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950">
                  <span className="font-bold block text-[10px] text-emerald-800 uppercase font-sans">
                    Selected Implementation ({item.chosen})
                  </span>
                  {item.chosenComplexity}
                </div>
                <div className="p-2 bg-rose-50/80 border border-rose-200 rounded-lg text-rose-950">
                  <span className="font-bold block text-[10px] text-rose-800 uppercase font-sans">
                    Rejected Alternative ({item.alternative})
                  </span>
                  {item.altComplexity}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                <strong>Proof & Justification:</strong> {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
