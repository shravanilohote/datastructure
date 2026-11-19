import React, { useState } from 'react';
import {
  Network,
  Layers,
  Bell,
  Award,
  ArrowDown,
  ArrowRight,
  Database,
  Server,
  Zap,
  ShieldAlert,
  CheckCircle2,
  Workflow,
  Cpu,
  Share2
} from 'lucide-react';

export function ArchitectureFlow() {
  const [activeModuleFlow, setActiveModuleFlow] = useState('graph'); // 'graph', 'heap', 'queue', 'stack'

  const moduleFlows = {
    graph: {
      title: 'Module 1: Follow System &rarr; Directed Graph Pipeline',
      input: 'User clicks "Follow" on creator @zeal_design',
      steps: [
        {
          stage: '1. UI Dispatch',
          action: 'Follow button triggers `followUser(toId)` action with current userId',
          complexity: 'O(1) time'
        },
        {
          stage: '2. Directed Edge Insertion',
          action: 'Adjacency list executes `Adj[fromId].add(toId)` & reverse index `Followers[toId].add(fromId)`',
          complexity: 'O(1) average hash set insertion'
        },
        {
          stage: '3. State Mutation',
          action: 'Graph version increments; local adjacency list state and graph canvas re-render',
          complexity: 'O(V + E) render'
        },
        {
          stage: '4. Asynchronous Fanout',
          action: 'System publishes a "New Follower" notification payload into the FIFO Queue',
          complexity: 'O(1) enqueue at rear'
        }
      ],
      output: 'Graph edge rendered with red directed arrow; mutual connection set recalculated in O(min(dA, dB)).'
    },
    heap: {
      title: 'Module 2: Home Feed Candidate Ranking &rarr; Max-Heap Pipeline',
      input: 'New pin submitted or candidate feed items retrieved from storage',
      steps: [
        {
          stage: '1. Engagement Score Computation',
          action: 'Calculates multi-factor score: (Saves × 3.5) + (Likes × 2.0) + (Comments × 1.8) + RecencyBonus',
          complexity: 'O(1) arithmetic'
        },
        {
          stage: '2. Heap Insertion',
          action: 'Pin object pushed to bottom array index `heap[n]`. `siftUp()` begins comparison with `parent = floor((i-1)/2)`',
          complexity: 'O(log n) swaps'
        },
        {
          stage: '3. Invariant Restoration',
          action: 'Bubble up terminates when parent.score >= child.score or root index 0 is reached',
          complexity: 'At most ⌊log₂ n⌋ iterations'
        },
        {
          stage: '4. Viewport Delivery',
          action: 'Root node at index 0 pinned as #1 priority; Top-K filter performs K sift-down extractions',
          complexity: 'O(K log n) extraction'
        }
      ],
      output: 'Masonry feed populated in ranked order with root pin bearing the MAX ROOT badge.'
    },
    queue: {
      title: 'Module 3: Real-Time Notifications &rarr; FIFO Queue Pipeline',
      input: 'Asynchronous platform trigger (Pin saved, comment added, creator followed)',
      steps: [
        {
          stage: '1. Event Ingestion',
          action: 'Worker thread packages event payload with timestamp, sender metadata, and unread flag',
          complexity: 'O(1)'
        },
        {
          stage: '2. Tail Enqueue',
          action: 'Queue node created. Tail pointer updated: `tail.next = newNode; tail = newNode; length++`',
          complexity: 'O(1) constant pointer update'
        },
        {
          stage: '3. Badge Synchronization',
          action: 'Unread counter incremented in constant time; Navbar notification bell displays red count',
          complexity: 'O(1)'
        },
        {
          stage: '4. Consumer Dequeue',
          action: 'User opens inbox / processes oldest: `removed = head; head = head.next; length--`',
          complexity: 'O(1) without array re-indexing'
        }
      ],
      output: 'Notification rendered in strict chronological sequence; no older notification blocked.'
    },
    stack: {
      title: 'Module 4: Pin Studio Editing &rarr; LIFO Stack Pipeline',
      input: 'User applies visual filter, changes typography overlay, or resizes crop ratio',
      steps: [
        {
          stage: '1. Snapshot Packaging',
          action: 'Studio serializes current canvas properties (filter, text, size, color, badge)',
          complexity: 'O(1) shallow copy'
        },
        {
          stage: '2. Undo Stack Push',
          action: 'New state frame pushed to top of `undoStack` (`items.push(frame)`)',
          complexity: 'O(1) amortized'
        },
        {
          stage: '3. Redo Invalidation',
          action: 'Critical step: If `redoStack.size() > 0`, clear all redo frames immediately to maintain causal consistency',
          complexity: 'O(1) clear'
        },
        {
          stage: '4. Undo / Redo Pop',
          action: 'Undo pops latest from `undoStack`, pushes to `redoStack`, restoring previous top frame',
          complexity: 'O(1) pop and peek'
        }
      ],
      output: 'Instant canvas state restoration; stack visualization reflects new TOP element.'
    }
  };

  const scalabilitySolutions = [
    {
      title: '1. High-Follower Accounts ("The Celebrity Supernode Problem")',
      issue:
        'When an account with 10M followers publishes a pin, fan-out-on-write pushes to 10M feed queues simultaneously, creating massive write latency.',
      mitigation:
        'Hybrid Push/Pull Architecture: Standard users use push fanout. Celebrity accounts (supernodes) use pull-on-read, querying the creator’s out-edges only when followers actively open their feed.',
      dsRole: 'Directed graph degree thresholding: if d_in > 25,000, mark vertex as pull-mode.'
    },
    {
      title: '2. Viral Pins & High-Volume Read Concurrency',
      issue:
        'Trending visual pins experience millions of simultaneous read hits, causing heap contention and database bottlenecks.',
      mitigation:
        'Multi-Tier Redis Caching & Read Replicas: Top-ranked root and upper-level heap nodes are cached in fast in-memory Redis clusters with TTL invalidation.',
      dsRole: 'Max-Heap root is mirrored into a distributed key-value cache in O(1) time.'
    },
    {
      title: '3. Notification Bursts & Event Pipeline Congestion',
      issue:
        'Spikes in activity (e.g. festive seasons, viral campaigns) generate hundreds of thousands of events per second, exhausting single-queue memory.',
      mitigation:
        'Partitioned Queueing with Consumer Groups: Topics are partitioned using user ID hashing (e.g. Kafka/RabbitMQ). Distributed worker groups consume from independent queues.',
      dsRole: 'Partitioned FIFO queues ensure sequential delivery per user without global bottlenecks.'
    },
    {
      title: '4. Large Candidate Feed Volumes (100,000+ Pins)',
      issue:
        'Maintaining a complete Max-Heap of every candidate pin in platform storage wastes memory and degrades insertion latency.',
      mitigation:
        'Bounded Min-Max Heaps & Two-Stage Ranking: A lightweight filtering stage selects top 1,000 candidates. A bounded Max-Heap of size K maintains only the top K pins, evicting the minimum in O(log K).',
      dsRole: 'Bounded heap size guarantees O(log K) rather than O(log N) insertion bounds.'
    },
    {
      title: '5. Memory Limits in Studio History (Deep Edit Stacks)',
      issue:
        'Retaining thousands of high-resolution canvas state snapshots can trigger browser memory leaks.',
      mitigation:
        'Bounded Stack Depth & Differential Deltas: Stack depth is capped at s = 50. Edits store only inverse transformation deltas rather than full image bitmaps.',
      dsRole: 'Circular ring buffer or bounded stack maintains strict O(s) memory ceiling.'
    }
  ];

  const currentFlow = moduleFlows[activeModuleFlow];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            System Architecture & Scalability Flow
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-100 text-slate-800 rounded-md">
            End-to-End System Design
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          How Pinterest maps high-level user actions into underlying data structures, and how distributed scale is achieved in production.
        </p>
      </div>

      {/* High-Level Architecture Block Diagram */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 mb-8">
        <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-red-600" />
          High-Level User Session & Data Structure Mapping
        </h3>

        {/* Visual Architecture Tree */}
        <div className="p-6 bg-slate-950 text-white rounded-2xl overflow-x-auto">
          <div className="min-w-[620px] flex flex-col items-center">
            {/* Root Session */}
            <div className="px-6 py-3 bg-red-600 text-white rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 border border-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
              Pinterest-like User Session (PinLogic Engine)
            </div>

            {/* Down Connector */}
            <div className="w-0.5 h-8 bg-slate-700"></div>

            {/* Horizontal Branching Bar */}
            <div className="w-[84%] h-0.5 bg-slate-700 relative">
              <div className="absolute top-0 left-0 w-0.5 h-6 bg-slate-700"></div>
              <div className="absolute top-0 left-1/3 w-0.5 h-6 bg-slate-700 -translate-x-1/2"></div>
              <div className="absolute top-0 left-2/3 w-0.5 h-6 bg-slate-700 -translate-x-1/2"></div>
              <div className="absolute top-0 right-0 w-0.5 h-6 bg-slate-700"></div>
            </div>

            {/* Module Nodes */}
            <div className="w-full grid grid-cols-4 gap-4 pt-6">
              {/* Branch 1 */}
              <div
                onClick={() => setActiveModuleFlow('graph')}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition ${
                  activeModuleFlow === 'graph'
                    ? 'bg-red-900/40 border-red-500 ring-2 ring-red-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-red-400 font-bold mb-1">MODULE 1</div>
                <div className="font-bold text-xs text-white">Follow System</div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 py-1 rounded border border-emerald-800">
                  Directed Graph
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Adj List + Hash Sets</span>
              </div>

              {/* Branch 2 */}
              <div
                onClick={() => setActiveModuleFlow('heap')}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition ${
                  activeModuleFlow === 'heap'
                    ? 'bg-amber-900/40 border-amber-500 ring-2 ring-amber-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-amber-400 font-bold mb-1">MODULE 2</div>
                <div className="font-bold text-xs text-white">Home Feed</div>
                <div className="mt-2 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 py-1 rounded border border-amber-800">
                  Max-Heap
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Priority Ranking Array</span>
              </div>

              {/* Branch 3 */}
              <div
                onClick={() => setActiveModuleFlow('queue')}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition ${
                  activeModuleFlow === 'queue'
                    ? 'bg-blue-900/40 border-blue-500 ring-2 ring-blue-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-blue-400 font-bold mb-1">MODULE 3</div>
                <div className="font-bold text-xs text-white">Notifications</div>
                <div className="mt-2 text-xs font-mono font-bold text-blue-400 bg-blue-950/60 py-1 rounded border border-blue-800">
                  FIFO Queue
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Front & Rear Pointers</span>
              </div>

              {/* Branch 4 */}
              <div
                onClick={() => setActiveModuleFlow('stack')}
                className={`p-3.5 rounded-xl border text-center cursor-pointer transition ${
                  activeModuleFlow === 'stack'
                    ? 'bg-rose-900/40 border-rose-500 ring-2 ring-rose-400'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-rose-400 font-bold mb-1">MODULE 4</div>
                <div className="font-bold text-xs text-white">Pin Editor Studio</div>
                <div className="mt-2 text-xs font-mono font-bold text-rose-400 bg-rose-950/60 py-1 rounded border border-rose-800">
                  LIFO Stack
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Dual Undo/Redo Stacks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Flowchart */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-600" />
              Detailed Data Flow Pipeline: {currentFlow.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Input Trigger: <span className="font-mono text-slate-800 font-semibold">{currentFlow.input}</span>
            </p>
          </div>
          <div className="flex gap-1.5">
            {['graph', 'heap', 'queue', 'stack'].map(key => (
              <button
                key={key}
                onClick={() => setActiveModuleFlow(key)}
                className={`px-3 py-1 text-xs font-bold capitalize rounded-lg transition ${
                  activeModuleFlow === key
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Step Progression Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {currentFlow.steps.map((st, i) => (
            <div key={i} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between text-xs">
              <div>
                <span className="font-bold text-[10px] uppercase text-red-600 block mb-1">
                  {st.stage}
                </span>
                <p className="text-slate-800 font-medium leading-snug">
                  {st.action}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 font-mono text-[10px] text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" />
                {st.complexity}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Resulting Platform State:</strong> {currentFlow.output}
          </span>
        </div>
      </div>

      {/* Production Scalability & Mitigation Engineering */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
        <div className="pb-3 border-b border-gray-100 mb-5">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Server className="w-5 h-5 text-red-600" />
            10. Production Scalability & Mitigation Strategies
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            How foundational data structures scale when handling Pinterest’s 500+ million monthly active users and 100+ billion visual pins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scalabilitySolutions.map((sol, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col justify-between"
            >
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm mb-2 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  {sol.title}
                </h4>
                <div className="text-xs text-slate-600 mb-2 space-y-1">
                  <p><strong>Challenge:</strong> {sol.issue}</p>
                  <p className="text-slate-700"><strong>Mitigation:</strong> {sol.mitigation}</p>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-200 text-[11px] font-mono text-indigo-700 bg-indigo-50/60 p-2 rounded-lg">
                <strong>Data Structure Role:</strong> {sol.dsRole}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
