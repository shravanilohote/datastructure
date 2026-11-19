import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, Sparkles, RefreshCw, Layers, Compass, Code } from 'lucide-react';

export function Navbar() {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    unreadCount,
    markAllNotificationsRead,
    resetDemoData
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4 transition-all">
      {/* Brand Logo & College Label */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
        <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform flex-shrink-0">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.1-2.52.02-3.6.11-.99.74-6.4 1.15-8.2.14-.62.53-1.04 1.17-1.04 1.63 0 2.87 1.5 2.87 3.52 0 2.22-1.41 5.53-2.14 8.6-.2 1.02.43 1.87 1.25 1.87 1.5 0 2.66-1.58 2.66-3.86 0-2.01-.89-3.51-2.12-4.57a3.54 3.54 0 0 1-1.02-2.73c0-2.55 1.86-4.91 5.06-4.91 2.66 0 4.72 1.9 4.72 4.43 0 2.64-1.66 4.77-3.97 4.77-.77 0-1.5-.4-1.75-.88l-.48 1.82c-.17.67-.64 1.5-.96 2.01A12.01 12.01 0 1 0 12 0z" />
          </svg>
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 text-lg tracking-tight hover:text-red-600 transition">
              PinLogic
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700 rounded-md uppercase tracking-wider">
              DS Engine
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-none">
            Zeal College of Engg. &bull; Narhe, Pune
          </p>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-2xl relative mx-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pins, creators, algorithms (Heap, Graph, Queue, Stack)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-200/80 focus:bg-white text-xs sm:text-sm text-slate-900 rounded-full border border-transparent focus:border-red-400 focus:outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Lab Button Highlight */}
        <button
          onClick={() => setActiveTab('lab')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all shadow-xs ${
            activeTab === 'lab'
              ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400'
              : 'bg-slate-900 hover:bg-red-600 text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span className="hidden md:inline">DS Lab</span>
        </button>

        {/* Notifications Icon with Unread Badge */}
        <button
          onClick={() => {
            setActiveTab('notifications');
            markAllNotificationsRead();
          }}
          className="relative p-2 rounded-full text-slate-700 hover:bg-slate-100 transition"
          title="Notification Center (FIFO Queue)"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Pill */}
        <div
          onClick={() => setActiveTab('people')}
          className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 cursor-pointer border border-transparent hover:border-gray-200 transition"
          title="Switch / View Profile"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Shravani Lohote"
            className="w-7 h-7 rounded-full object-cover ring-2 ring-red-500/40"
          />
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-slate-800 block leading-tight">Shravani L.</span>
            <span className="text-[10px] text-slate-400 block leading-none">ALGO_MINDS Lead</span>
          </div>
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={resetDemoData}
          title="Reset to default initial data"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
