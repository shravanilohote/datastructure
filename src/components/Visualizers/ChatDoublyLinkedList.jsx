import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MessageSquare, CornerDownRight, Send } from 'lucide-react';

export function ChatDoublyLinkedList({ chatList, onSendMessage, currentUserId }) {
  const [inputText, setInputText] = useState('');
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);

  const messages = chatList.toArray();
  const activeMessage = messages[activeNodeIndex] || messages[messages.length - 1];

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
    setActiveNodeIndex(messages.length); // Point to new tail
  };

  const goToPrev = () => {
    if (activeNodeIndex > 0) {
      setActiveNodeIndex(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (activeNodeIndex < messages.length - 1) {
      setActiveNodeIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/40 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <h4 className="font-semibold text-slate-900 text-sm">
              Doubly Linked List Chat Stream
            </h4>
            <span className="px-2 py-0.5 text-xs font-mono bg-indigo-100 text-indigo-800 rounded-md">
              Nodes: {messages.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Every message node has pointers <code className="text-indigo-600 font-bold">prev &larr; [DATA] &rarr; next</code> for bidirectional traversal in O(1).
          </p>
        </div>

        {/* Doubly linked list stepper */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToPrev}
            disabled={activeNodeIndex <= 0}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition"
            title="Follow 'prev' pointer (O(1))"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Prev Node
          </button>
          <span className="text-xs font-mono text-slate-500 px-1">
            Node {activeNodeIndex + 1}/{messages.length}
          </span>
          <button
            onClick={goToNext}
            disabled={activeNodeIndex >= messages.length - 1}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition"
            title="Follow 'next' pointer (O(1))"
          >
            Next Node
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Chat Feed */}
        <div className="lg:col-span-7 p-4 bg-slate-50/50 flex flex-col justify-between h-[340px]">
          <div className="overflow-y-auto space-y-3 pr-2">
            {messages.map((item, idx) => {
              const msg = item.data;
              const isSelected = idx === activeNodeIndex;
              return (
                <div
                  key={item.nodeId}
                  onClick={() => setActiveNodeIndex(idx)}
                  className={`flex gap-2.5 cursor-pointer transition-all ${
                    msg.isMe ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.senderName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
                  />
                  <div
                    className={`max-w-[78%] p-3 rounded-2xl text-xs shadow-2xs ${
                      msg.isMe
                        ? isSelected
                          ? 'bg-red-600 text-white ring-2 ring-red-400'
                          : 'bg-slate-900 text-white'
                        : isSelected
                        ? 'bg-indigo-50 border border-indigo-300 text-slate-900 ring-2 ring-indigo-200'
                        : 'bg-white border border-gray-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-bold text-[10px] ${msg.isMe ? 'text-rose-100' : 'text-slate-500'}`}>
                        {msg.senderName}
                      </span>
                      <span className={`text-[9px] ${msg.isMe ? 'text-rose-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Input Box */}
          <form onSubmit={handleSend} className="mt-3 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to append to tail in O(1)..."
              className="flex-1 px-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              Append
            </button>
          </form>
        </div>

        {/* Node Memory & Pointers Panel */}
        <div className="lg:col-span-5 p-4 border-t lg:border-t-0 lg:border-l border-gray-200 bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Node Memory Structure
              </span>
              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                DLL Node #{activeNodeIndex}
              </span>
            </div>

            {activeMessage ? (
              <div className="space-y-3">
                {/* Previous pointer */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3 text-indigo-500" />
                    Pointer: prev
                  </div>
                  <div className="truncate text-slate-700 font-semibold">
                    {activeMessage.hasPrev ? (
                      <span className="text-indigo-600">
                        &larr; Node #{activeNodeIndex - 1} ({messages[activeNodeIndex - 1]?.data?.senderName?.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">null (Head of Doubly Linked List)</span>
                    )}
                  </div>
                </div>

                {/* Node data block */}
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-xs">
                  <div className="text-[10px] text-indigo-700 font-bold uppercase mb-1">
                    Node Data Payload
                  </div>
                  <div className="text-slate-800 font-medium">
                    &ldquo;{activeMessage.data.text}&rdquo;
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 flex justify-between">
                    <span>Sender: {activeMessage.data.senderName}</span>
                    <span>Time: {activeMessage.data.timestamp}</span>
                  </div>
                </div>

                {/* Next pointer */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
                  <div className="text-[10px] text-slate-400 font-bold uppercase mb-0.5 flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-indigo-500" />
                    Pointer: next
                  </div>
                  <div className="truncate text-slate-700 font-semibold">
                    {activeMessage.hasNext ? (
                      <span className="text-indigo-600">
                        &rarr; Node #{activeNodeIndex + 1} ({messages[activeNodeIndex + 1]?.data?.senderName?.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">null (Tail of Doubly Linked List)</span>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-3 p-2 bg-slate-50 rounded-lg border border-gray-100 text-[11px] text-slate-500">
            <strong>DLL Advantage:</strong> Constant time $O(1)$ bidirectional step navigation without re-indexing.
          </div>
        </div>
      </div>
    </div>
  );
}
