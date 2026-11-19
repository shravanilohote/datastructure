import React from 'react';
import { ArrowRight, ArrowLeft, Clock, Bell, CheckCircle2, PlayCircle, FastForward } from 'lucide-react';

export function QueueVisualizer({ queue, onDequeue, onEnqueueSample }) {
  const items = queue.toArray();
  const logs = queue.historyLogs || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h4 className="font-semibold text-slate-900 text-sm">
              Live FIFO Notification Queue Conveyor
            </h4>
            <span className="px-2 py-0.5 text-xs font-mono bg-blue-100 text-blue-800 rounded-md">
              m = {items.length} items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict First-In First-Out: Enqueue at <strong className="text-purple-600">REAR</strong>, Dequeue from <strong className="text-blue-600">FRONT</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDequeue}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition shadow-2xs"
            title="Dequeue oldest notification in O(1)"
          >
            <FastForward className="w-3.5 h-3.5" />
            Dequeue Front (O(1))
          </button>
          <button
            onClick={onEnqueueSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-2xs"
            title="Enqueue new event in O(1)"
          >
            <PlayCircle className="w-3.5 h-3.5 text-purple-600" />
            + Enqueue Sample (O(1))
          </button>
        </div>
      </div>

      {/* Main Conveyor Line */}
      <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center overflow-x-auto min-h-[190px]">
        {items.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">Notification Queue is empty (Head == Tail == null).</p>
            <p className="text-xs text-slate-400 mt-1">Click &ldquo;+ Enqueue Sample&rdquo; to simulate a real-time event.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 w-full justify-start md:justify-center py-4">
            {/* FRONT Pointer Label */}
            <div className="flex flex-col items-center flex-shrink-0 mr-1 text-center">
              <span className="px-2.5 py-1 bg-blue-600 text-white rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm">
                FRONT [Head]
              </span>
              <span className="text-xs text-blue-600 font-bold mt-1">&darr; Dequeue</span>
            </div>

            {/* Queue Nodes */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 px-1">
              {items.map((item, index) => {
                const isFront = index === 0;
                const isRear = index === items.length - 1;

                return (
                  <React.Fragment key={item.id || index}>
                    <div
                      className={`relative flex-shrink-0 w-48 p-3 rounded-xl border transition-all shadow-xs ${
                        isFront
                          ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300/60'
                          : isRear
                          ? 'bg-purple-50/90 border-purple-400 ring-2 ring-purple-300/60'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* Node Index Badge */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200/80 rounded text-slate-700">
                          Pos #{index}
                        </span>
                        {isFront && (
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                            Next Out
                          </span>
                        )}
                        {isRear && (
                          <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                            Last In
                          </span>
                        )}
                      </div>

                      <h6 className="font-bold text-slate-900 text-xs truncate">
                        {item.title}
                      </h6>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {item.message}
                      </p>

                      <div className="mt-2 pt-1.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{item.timeAgo || 'Just now'}</span>
                        <span className="font-mono text-[9px]">O(1) pop</span>
                      </div>
                    </div>

                    {/* Node link arrow */}
                    {index < items.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* REAR Pointer Label */}
            <div className="flex flex-col items-center flex-shrink-0 ml-1 text-center">
              <span className="px-2.5 py-1 bg-purple-600 text-white rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm">
                REAR [Tail]
              </span>
              <span className="text-xs text-purple-600 font-bold mt-1">&uarr; Enqueue</span>
            </div>
          </div>
        )}
      </div>

      {/* Log Feed */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Latest Action:</span>
          <span className="text-slate-800 font-semibold truncate max-w-[450px]">
            {logs.length > 0 ? logs[0] : 'Queue initialized in memory.'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600">
          <span>Enqueue: <strong className="text-emerald-600">O(1)</strong></span>
          <span>Dequeue: <strong className="text-blue-600">O(1)</strong></span>
          <span>Space: <strong className="text-purple-600">O(m)</strong></span>
        </div>
      </div>
    </div>
  );
}
