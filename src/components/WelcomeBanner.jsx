import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Binary, Network, Layers, Bell, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export function WelcomeBanner() {
  const { setActiveTab, graph, maxHeap, notificationQueue } = useApp();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 md:p-8 mb-6 shadow-xl border border-slate-700/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Main Title & Mission */}
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-red-600/90 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Activity 2: Data Structures
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-slate-200 text-[11px] font-semibold rounded-full border border-white/10">
              Team ALGO_MINDS
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-slate-200 text-[11px] font-semibold rounded-full border border-white/10">
              Zeal College of Engineering & Research, Pune
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            PinLogic: Exploring Pinterest Through Data Structures
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            An interactive, academic platform demonstrating how four foundational computer science data structures power real-time visual discovery, personalized ranking, notification dispatch, and stateful editing at scale.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <button
              onClick={() => setActiveTab('lab')}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-lg shadow-red-900/30 active:scale-95"
            >
              <Binary className="w-4 h-4" />
              Enter Data Structure Lab
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('complexity')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition border border-white/10"
            >
              Complexity Bounds & Proofs
            </button>
          </div>
        </div>

        {/* Live Active Structure Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 min-w-[260px]">
          <div
            onClick={() => setActiveTab('people')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition text-left group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-red-400 transition">
                Directed Graph
              </span>
              <Network className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              V={graph.getVertexCount()} E={graph.getEdgeCount()}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">O(1) Follow Hash Set</p>
          </div>

          <div
            onClick={() => setActiveTab('home')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition text-left group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-amber-400 transition">
                Max-Heap
              </span>
              <Layers className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              n={maxHeap.size()} Pins
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">O(1) Peek / O(log n) Insert</p>
          </div>

          <div
            onClick={() => setActiveTab('notifications')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition text-left group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-400 transition">
                FIFO Queue
              </span>
              <Bell className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              m={notificationQueue.size()} Events
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Front & Rear O(1)</p>
          </div>

          <div
            onClick={() => setActiveTab('create')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition text-left group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-rose-400 transition">
                LIFO Stack
              </span>
              <Award className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <div className="text-lg font-black text-white font-mono">
              Undo/Redo
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">O(1) Push & Pop</p>
          </div>
        </div>
      </div>
    </div>
  );
}
