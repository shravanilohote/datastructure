import React from 'react';
import { Layers, Undo2, Redo2, ArrowUp, AlertCircle, Sparkles } from 'lucide-react';

export function StackVisualizer({ undoStackView = [], redoStackView = [], onUndo, onRedo, canUndo, canRedo, logs = [] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-rose-50/30 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h4 className="font-semibold text-slate-900 text-sm">
              LIFO Stack Architecture (Undo / Redo Engines)
            </h4>
            <span className="px-2 py-0.5 text-xs font-mono bg-rose-100 text-rose-800 rounded-md">
              Undo Depth: {undoStackView.length} | Redo Depth: {redoStackView.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Last-In First-Out: Operations push/pop at <strong className="text-rose-600">TOP OF STACK</strong> in <strong className="text-emerald-600">O(1)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition shadow-2xs"
            title="Pop from Undo stack, push to Redo stack (O(1))"
          >
            <Undo2 className="w-3.5 h-3.5 text-rose-600" />
            Undo (O(1))
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition shadow-2xs"
            title="Pop from Redo stack, push to Undo stack (O(1))"
          >
            <Redo2 className="w-3.5 h-3.5 text-blue-600" />
            Redo (O(1))
          </button>
        </div>
      </div>

      {/* Side-by-side Dual Stack Visualization */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
        {/* Undo Stack Tube */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Primary Undo Stack
              </h5>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Pointer: TOP &rarr; index {undoStackView.length > 0 ? undoStackView.length - 1 : 'empty'}
            </span>
          </div>

          <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto p-2 bg-white rounded-xl border-2 border-dashed border-rose-200 flex flex-col gap-1.5">
            {undoStackView.length === 0 ? (
              <div className="m-auto text-center text-slate-400 text-xs">Undo stack empty</div>
            ) : (
              undoStackView.map((item, idx) => {
                const isTop = idx === 0; // In stack view, index 0 is top
                return (
                  <div
                    key={item.id || idx}
                    className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isTop
                        ? 'bg-rose-50 border-rose-300 shadow-xs ring-1 ring-rose-200'
                        : 'bg-gray-50 border-gray-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isTop ? (
                        <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[9px] font-bold font-mono uppercase">
                          TOP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          #{item.stackIndex}
                        </span>
                      )}
                      <span className="font-semibold text-slate-900 truncate">
                        {item.description}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                      {item.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Redo Stack Tube */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Redo Stack (Cleared on new edit)
              </h5>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Depth: {redoStackView.length}
            </span>
          </div>

          <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto p-2 bg-white rounded-xl border-2 border-dashed border-blue-200 flex flex-col gap-1.5">
            {redoStackView.length === 0 ? (
              <div className="m-auto text-center text-slate-400 text-xs">
                <p>Redo stack is empty.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Undo an edit to push into this stack.</p>
              </div>
            ) : (
              redoStackView.map((item, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={item.id || idx}
                    className={`p-2 rounded-lg border transition-all text-xs flex items-center justify-between ${
                      isTop
                        ? 'bg-blue-50 border-blue-300 shadow-xs ring-1 ring-blue-200'
                        : 'bg-gray-50 border-gray-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isTop ? (
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold font-mono uppercase">
                          TOP
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          #{item.stackIndex}
                        </span>
                      )}
                      <span className="font-semibold text-slate-900 truncate">
                        {item.description}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                      {item.timestamp}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Rule Notice & Top Log */}
      <div className="p-3 bg-amber-50/70 border-t border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-900 font-medium">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>LIFO Invariant:</strong> Any new edit after an Undo operation <em>immediately purges</em> the Redo stack to maintain causal consistency.
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-600">
          Push: <strong className="text-emerald-700">O(1)</strong> | Pop: <strong className="text-emerald-700">O(1)</strong> | Space: <strong className="text-slate-800">O(s)</strong>
        </div>
      </div>
    </div>
  );
}
