import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraphVisualizer } from '../components/Visualizers/GraphVisualizer';
import { HeapTreeVisualizer } from '../components/Visualizers/HeapTreeVisualizer';
import { QueueVisualizer } from '../components/Visualizers/QueueVisualizer';
import { StackVisualizer } from '../components/Visualizers/StackVisualizer';
import {
  Binary,
  Network,
  Layers,
  Bell,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  Cpu,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export function DataStructureLab() {
  const {
    graph,
    graphVersion,
    currentUserId,
    followUser,
    unfollowUser,
    checkFollowStatus,
    getMutualFollowings,
    maxHeap,
    heapVersion,
    insertPinToFeed,
    extractMaxPin,
    peekMaxPin,
    notificationQueue,
    queueVersion,
    enqueueNotification,
    dequeueNotification
  } = useApp();

  const [activeLabTab, setActiveLabTab] = useState('graph'); // 'graph', 'heap', 'queue', 'stack'

  // Graph sandbox state
  const [labSelectedUser, setLabSelectedUser] = useState('user_shravani');
  const [labTargetUser, setLabTargetUser] = useState('user_khushi');

  // Heap sandbox state
  const [labPinTitle, setLabPinTitle] = useState('Bauhaus Minimal Poster');
  const [labPinScore, setLabPinScore] = useState(650);

  // Queue sandbox state
  const [labQueueMsg, setLabQueueMsg] = useState('Kiran saved your Architectural Digest Pin.');

  // Stack sandbox state (dedicated lab stack)
  const [labStackItems, setLabStackItems] = useState([
    { id: 's1', name: 'Base Photo Loaded', timestamp: '11:00 AM' },
    { id: 's2', name: 'Added Text "Art"', timestamp: '11:02 AM' },
    { id: 's3', name: 'Applied Grayscale Filter', timestamp: '11:05 AM' }
  ]);
  const [labRedoItems, setLabRedoItems] = useState([]);
  const [labStackInput, setLabStackInput] = useState('Resized canvas to 3:4');
  const [labStackLogs, setLabStackLogs] = useState([
    '[INIT] Stack populated with baseline edit history.'
  ]);

  const handleLabStackPush = (e) => {
    e.preventDefault();
    if (!labStackInput.trim()) return;
    const newItem = {
      id: `s_${Date.now()}`,
      name: labStackInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setLabStackItems(prev => [...prev, newItem]);
    if (labRedoItems.length > 0) {
      setLabRedoItems([]);
      setLabStackLogs(prev => [
        `[PUSH] Pushed "${newItem.name}". Purged ${labRedoItems.length} Redo state(s) (LIFO Branch Invariant).`,
        ...prev
      ]);
    } else {
      setLabStackLogs(prev => [
        `[PUSH] Pushed "${newItem.name}" onto Undo Stack in O(1).`,
        ...prev
      ]);
    }
    setLabStackInput('');
  };

  const handleLabStackUndo = () => {
    if (labStackItems.length <= 1) return;
    const popped = labStackItems[labStackItems.length - 1];
    setLabStackItems(prev => prev.slice(0, prev.length - 1));
    setLabRedoItems(prev => [...prev, popped]);
    setLabStackLogs(prev => [
      `[UNDO] Popped "${popped.name}" from Undo Stack &rarr; Pushed to Redo Stack in O(1).`,
      ...prev
    ]);
  };

  const handleLabStackRedo = () => {
    if (labRedoItems.length === 0) return;
    const popped = labRedoItems[labRedoItems.length - 1];
    setLabRedoItems(prev => prev.slice(0, prev.length - 1));
    setLabStackItems(prev => [...prev, popped]);
    setLabStackLogs(prev => [
      `[REDO] Popped "${popped.name}" from Redo Stack &rarr; Pushed back to Undo Stack in O(1).`,
      ...prev
    ]);
  };

  const labUndoStackView = [...labStackItems].reverse().map((item, idx) => ({
    id: item.id,
    description: item.name,
    timestamp: item.timestamp,
    stackIndex: labStackItems.length - 1 - idx,
    isTop: idx === 0
  }));

  const labRedoStackView = [...labRedoItems].reverse().map((item, idx) => ({
    id: item.id,
    description: item.name,
    timestamp: item.timestamp,
    stackIndex: labRedoItems.length - 1 - idx,
    isTop: idx === 0
  }));

  const labTabs = [
    {
      id: 'graph',
      name: '1. Directed Graph',
      subtitle: 'Follow Network',
      icon: Network,
      color: 'text-red-600',
      tag: 'O(1) Set Lookup'
    },
    {
      id: 'heap',
      name: '2. Max-Heap',
      subtitle: 'Feed Priority Queue',
      icon: Layers,
      color: 'text-amber-600',
      tag: 'O(log n) Heapify'
    },
    {
      id: 'queue',
      name: '3. FIFO Queue',
      subtitle: 'Notification Pipeline',
      icon: Bell,
      color: 'text-blue-600',
      tag: 'O(1) Enqueue/Dequeue'
    },
    {
      id: 'stack',
      name: '4. LIFO Stack',
      subtitle: 'Pin Studio Undo/Redo',
      icon: Award,
      color: 'text-rose-600',
      tag: 'O(1) Push/Pop'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Title & Mission */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-xl border border-slate-700">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1.5">
            <Binary className="w-3.5 h-3.5" />
            Core Academic Section
          </span>
          <span className="text-xs font-mono text-slate-300">
            Zeal College &bull; ALGO_MINDS Research Demonstration
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          Behind the Pins &ndash; Data Structure Lab
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Explore the exact algorithmic engines powering Pinterest. Each module below presents an interactive playground, live state mutator, pseudocode walkthrough, and asymptotic complexity proofs.
        </p>
      </div>

      {/* Structure Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {labTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeLabTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveLabTab(tab.id)}
              className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-red-500 shadow-md ring-2 ring-red-100'
                  : 'bg-white hover:bg-slate-50 border-gray-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${tab.color}`} />
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.tag}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">{tab.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{tab.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DIRECTED GRAPH */}
      {activeLabTab === 'graph' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Concept & Definition Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Network className="w-5 h-5 text-red-600" />
                Directed Graph ($G = (V, E)$) in Pinterest
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Definition:</strong> A directed graph is a set of vertices $V$ connected by directed edges $E$, where each edge $(u, v)$ has an orientation from source vertex $u$ to target vertex $v$.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Why Suitable for Pinterest:</strong> Social relationships on discovery platforms are asymmetric: user $A$ follows user $B$ for inspiration ($A \to B$), but $B$ may not follow $A$. Adjacency lists paired with Hash Sets allow $O(1)$ relationship lookups and $O(\min(d_A, d_B))$ mutual connections without the $O(V^2)$ memory waste of an adjacency matrix.
              </p>
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-200 text-xs text-red-950 font-medium">
                <strong>Real-World Pinterest Engine:</strong> Pinterest uses <em>Pixie</em>, a specialized graph engine executing billions of random walks per second on an asymmetric bipartite pin-board-user graph to generate real-time recommendations.
              </div>
            </div>

            {/* Complexity Cheat Sheet */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Graph Complexity Bounds
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Follow (Edge Insert):</span>
                    <strong className="text-emerald-400">O(1) avg</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Unfollow (Edge Delete):</span>
                    <strong className="text-emerald-400">O(1) avg</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Follow Lookup (Edge Test):</span>
                    <strong className="text-emerald-400">O(1) avg</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Mutual Connections:</span>
                    <strong className="text-amber-400">O(min(dA, dB))</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">BFS Social Traversal:</span>
                    <strong className="text-blue-400">O(V + E)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Space Complexity:</span>
                    <strong className="text-purple-400">O(V + E)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Note: $V$ = total users; $E$ = total follows; $d$ = degree of user.
              </div>
            </div>
          </div>

          {/* Live Visualizer */}
          <GraphVisualizer
            graph={graph}
            currentUserId={currentUserId}
            selectedUserId={labSelectedUser}
            onSelectUser={(id) => setLabSelectedUser(id)}
          />

          {/* Pseudocode & Step-by-Step Logic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-700" />
                Algorithm: Mutual Connections Set Intersection
              </h4>
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`function getMutualFollowings(userA, userB):
  // Retrieve adjacency sets
  setA = Adj[userA] // O(1)
  setB = Adj[userB] // O(1)

  // Optimization: loop over smaller set
  [smaller, larger] = |setA| <= |setB| ? [setA, setB] : [setB, setA]
  mutual = []

  for vertex in smaller:         // O(min(dA, dB)) iterations
    if larger.contains(vertex):  // O(1) Hash Set check
      mutual.append(vertex)

  return mutual // Total: O(min(dA, dB))`}
              </pre>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-700" />
                Algorithm: Breadth-First Search (BFS) Social Distance
              </h4>
              <pre className="p-3 bg-slate-950 text-cyan-300 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`function bfsSocialDistance(startUser):
  visited = new Set([startUser])
  queue = [startUser]
  levels = { startUser: 0 }

  while queue is not empty:
    curr = queue.dequeue()
    for neighbor in Adj[curr]:
      if neighbor not in visited:
        visited.add(neighbor)
        levels[neighbor] = levels[curr] + 1
        queue.enqueue(neighbor)

  return levels // Total: O(V + E) time, O(V) space`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MAX-HEAP */}
      {activeLabTab === 'heap' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Concept Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                Max-Heap Priority Queue in Personalized Feed Ranking
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Definition:</strong> A Max-Heap is a complete binary tree where each node satisfies the heap property: <code className="font-mono text-amber-700 font-bold">parent.score &ge; child.score</code>. Represented compactly in memory using a 0-indexed array where left child is $2i+1$ and right child is $2i+2$.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Why Suitable for Pinterest:</strong> Users load only the top $K$ most engaging pins on their feed. Sorting a catalog of $N$ pins takes $O(N \log N)$ time. A Max-Heap builds in $O(N)$ and extracts the top $K$ pins in $O(K \log N)$ time, yielding immense computational savings when $K \ll N$.
              </p>
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                <strong>Mathematical Formula:</strong>
                <code className="block mt-1 font-mono text-[11px] text-amber-900">
                  Score = (Saves &times; 3.5) + (Likes &times; 2.0) + (Comments &times; 1.8) + RecencyBonus
                </code>
              </div>
            </div>

            {/* Complexity Card */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Max-Heap Asymptotic Bounds
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Peek Max (Inspect Root):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Insert Pin (Sift-Up):</span>
                    <strong className="text-blue-400">O(log n)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Extract Max (Sift-Down):</span>
                    <strong className="text-blue-400">O(log n)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Build Heap (Bottom-Up):</span>
                    <strong className="text-emerald-400">O(n)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Extract Top-K Pins:</span>
                    <strong className="text-amber-400">O(K log n)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Space Complexity:</span>
                    <strong className="text-purple-400">O(n)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Sorted Array comparison: Insert is $O(n)$, Top-K is $O(n \log n)$ upfront.
              </div>
            </div>
          </div>

          {/* Interactive Sandbox Controls */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={labPinTitle}
                onChange={(e) => setLabPinTitle(e.target.value)}
                placeholder="Pin Title..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-gray-300 rounded-lg"
              />
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-slate-500">Score:</span>
                <input
                  type="number"
                  value={labPinScore}
                  onChange={(e) => setLabPinScore(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs bg-slate-50 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => {
                  insertPinToFeed({
                    title: labPinTitle,
                    score: labPinScore,
                    saves: 100,
                    likes: 150,
                    comments: 10,
                    recencyBonus: 30,
                    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&auto=format&fit=crop&q=80',
                    category: 'Design'
                  });
                }}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                + Insert & Sift-Up (O(log n))
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={extractMaxPin}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Extract Max (O(log n))
              </button>
            </div>
          </div>

          {/* Binary Tree Visualizer */}
          <HeapTreeVisualizer
            maxHeap={maxHeap}
            onExtractMax={extractMaxPin}
            onPeekMax={peekMaxPin}
          />

          {/* Pseudocode Walkthrough */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-700" />
                Algorithm: Sift-Up Heap Insertion (O(log n))
              </h4>
              <pre className="p-3 bg-slate-950 text-amber-300 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`function insert(heap, pin):
  heap.push(pin) // place at leaf index
  curr = heap.length - 1

  while curr > 0:
    parentIdx = floor((curr - 1) / 2)
    if heap[curr].score > heap[parentIdx].score:
      swap(heap[curr], heap[parentIdx]) // bubble up
      curr = parentIdx
    else:
      break // heap invariant satisfied`}
              </pre>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-slate-700" />
                Algorithm: Sift-Down Extract Max (O(log n))
              </h4>
              <pre className="p-3 bg-slate-950 text-emerald-300 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`function extractMax(heap):
  if heap.empty: return null
  maxPin = heap[0]
  lastPin = heap.pop()
  if heap.length > 0:
    heap[0] = lastPin
    siftDown(0) // push smaller root down
  return maxPin`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FIFO QUEUE */}
      {activeLabTab === 'queue' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Concept Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                FIFO Queue in Real-Time Notification Pipelines
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Definition:</strong> A Queue is a linear data structure operating under First-In First-Out (FIFO) semantics. Items enter at the <strong className="text-purple-600">REAR</strong> and leave from the <strong className="text-blue-600">FRONT</strong>.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Why Suitable for Pinterest:</strong> Real-time user engagements (Pin saved, comment added, board invite) arrive asynchronously from distributed workers. A FIFO queue buffers these bursts without dropping messages, ensuring user notifications arrive in exact chronological order without priority inversion.
              </p>
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                <strong>Pointers Invariant:</strong> Maintaining explicit <code className="font-mono text-blue-700 font-bold">head</code> and <code className="font-mono text-purple-700 font-bold">tail</code> references prevents array element re-indexing, ensuring constant $O(1)$ operations compared to JavaScript’s native <code className="font-mono">Array.shift()</code> which is $O(m)$.
              </div>
            </div>

            {/* Complexity Card */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  FIFO Queue Complexity Bounds
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Enqueue (Push to Rear):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Dequeue (Pop from Front):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Peek Front:</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Unread Counter Read:</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Queue Space:</span>
                    <strong className="text-purple-400">O(m)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Alternative: Plain Array with shift() incurs $O(m)$ memory re-allocation penalty.
              </div>
            </div>
          </div>

          {/* Interactive Sandbox Controls */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 flex items-center gap-2 min-w-[280px]">
              <input
                type="text"
                value={labQueueMsg}
                onChange={(e) => setLabQueueMsg(e.target.value)}
                placeholder="Notification message to enqueue..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-gray-300 rounded-lg"
              />
              <button
                onClick={() => {
                  if (!labQueueMsg.trim()) return;
                  enqueueNotification({
                    type: 'custom',
                    title: 'Lab Notification Event',
                    message: labQueueMsg.trim(),
                    timeAgo: 'Just now',
                    color: 'bg-blue-50 text-blue-600 border-blue-200'
                  });
                  setLabQueueMsg('');
                }}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition shadow-2xs whitespace-nowrap"
              >
                + Enqueue Rear (O(1))
              </button>
            </div>

            <button
              onClick={dequeueNotification}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-2xs"
            >
              Dequeue Front (O(1))
            </button>
          </div>

          {/* Live Queue Visualizer */}
          <QueueVisualizer
            queue={notificationQueue}
            onDequeue={dequeueNotification}
            onEnqueueSample={() => enqueueNotification({
              type: 'save',
              title: 'Pin Saved',
              message: 'Lab sample: Monospace visual board updated.',
              timeAgo: 'Just now'
            })}
          />
        </div>
      )}

      {/* TAB 4: LIFO STACK */}
      {activeLabTab === 'stack' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Concept Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm lg:col-span-2">
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                LIFO Stack in Interactive Pin Creation & State Restoration
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Definition:</strong> A Stack is a restricted linear data structure adhering strictly to Last-In First-Out (LIFO). Elements are added and removed exclusively at the top of the stack pointer.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Why Suitable for Pinterest Pin Studio:</strong> When editing visual pins (applying image filters, placing stickers, resizing text), user modifications follow a strict chronological undo sequence. The most recent action must be undone first.
              </p>
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium">
                <strong>The Branching Invariant:</strong> If a user undos 3 actions and then performs a fresh new modification, the Redo stack must be immediately cleared ($O(1)$) because a new branch in the timeline has been established!
              </div>
            </div>

            {/* Complexity Card */}
            <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  Stack Asymptotic Bounds
                </h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Push (Record Action):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Pop (Undo State):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Peek (Inspect Top):</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Clear Redo on New Action:</span>
                    <strong className="text-emerald-400">O(1)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Stack Space:</span>
                    <strong className="text-purple-400">O(s)</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                Note: $s$ is the bounded history depth; snapshots store state differential deltas.
              </div>
            </div>
          </div>

          {/* Interactive Stack Sandbox Form */}
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <form onSubmit={handleLabStackPush} className="flex-1 flex items-center gap-2 min-w-[280px]">
              <input
                type="text"
                value={labStackInput}
                onChange={(e) => setLabStackInput(e.target.value)}
                placeholder="Enter state action (e.g. Changed font to 28px)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-gray-300 rounded-lg"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition shadow-2xs whitespace-nowrap"
              >
                + Push New State (O(1))
              </button>
            </form>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLabStackUndo}
                disabled={labStackItems.length <= 1}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Undo (Pop to Redo)
              </button>
              <button
                onClick={handleLabStackRedo}
                disabled={labRedoItems.length === 0}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition shadow-2xs"
              >
                Redo (Restore)
              </button>
            </div>
          </div>

          {/* Visual Dual Stack Tubes */}
          <StackVisualizer
            undoStackView={labUndoStackView}
            redoStackView={labRedoStackView}
            onUndo={handleLabStackUndo}
            onRedo={handleLabStackRedo}
            canUndo={labStackItems.length > 1}
            canRedo={labRedoItems.length > 0}
            logs={labStackLogs}
          />
        </div>
      )}
    </div>
  );
}
