import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  Compass,
  Users2,
  Bell,
  PlusCircle,
  Binary,
  LineChart,
  Network,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export function Sidebar() {
  const { activeTab, setActiveTab, unreadCount } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'Home Feed',
      sublabel: 'Max-Heap Ranking',
      icon: Home,
      badge: null
    },
    {
      id: 'explore',
      label: 'Explore Pins',
      sublabel: 'Visual Discovery',
      icon: Compass,
      badge: null
    },
    {
      id: 'people',
      label: 'People Network',
      sublabel: 'Directed Graph',
      icon: Users2,
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      sublabel: 'FIFO Queue & DLL',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      id: 'create',
      label: 'Create Pin',
      sublabel: 'LIFO Stack Studio',
      icon: PlusCircle,
      badge: 'LIFO'
    },
    {
      id: 'divider-1'
    },
    {
      id: 'lab',
      label: 'Data Structure Lab',
      sublabel: 'Behind The Pins (Core)',
      icon: Binary,
      highlight: true
    },
    {
      id: 'complexity',
      label: 'Complexity Analysis',
      sublabel: 'Asymptotic Bounds',
      icon: LineChart,
      badge: null
    },
    {
      id: 'architecture',
      label: 'Architecture & Flow',
      sublabel: 'Flowcharts & Scale',
      icon: Network,
      badge: null
    },
    {
      id: 'about',
      label: 'About Project',
      sublabel: 'ALGO_MINDS & Zeal',
      icon: GraduationCap,
      badge: null
    }
  ];

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-gray-200/80 flex flex-col justify-between py-4 select-none flex-shrink-0 transition-all duration-200">
      <div className="space-y-1 px-2 md:px-3">
        <div className="px-3 py-1 mb-2 hidden md:block">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Modules
          </span>
        </div>

        {navItems.map((item, index) => {
          if (item.id.startsWith('divider')) {
            return (
              <div key={item.id} className="py-2">
                <div className="border-t border-gray-200/80 my-1 mx-2"></div>
                <div className="px-3 py-1 hidden md:block">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Academic Research
                  </span>
                </div>
              </div>
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all text-left group relative ${
                isActive
                  ? item.highlight
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'bg-slate-900 text-white shadow-sm'
                  : item.highlight
                  ? 'text-red-600 bg-red-50 hover:bg-red-100/80'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={item.label}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? 'text-white'
                    : item.highlight
                    ? 'text-red-600'
                    : 'text-slate-500 group-hover:text-slate-900'
                }`}
              />

              <div className="hidden md:flex flex-1 items-center justify-between overflow-hidden">
                <div className="truncate">
                  <span className="font-semibold block truncate leading-tight">
                    {item.label}
                  </span>
                  <span
                    className={`text-[10px] block truncate ${
                      isActive
                        ? 'text-slate-300'
                        : item.highlight
                        ? 'text-red-500'
                        : 'text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badge === 'LIFO'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* College & Team Badge at Footer */}
      <div className="px-3 hidden md:block">
        <div className="p-3 bg-slate-50 rounded-2xl border border-gray-200/80 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span className="font-black text-xs text-slate-800 tracking-tight">ALGO_MINDS</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Activity 2: Data Structures
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200/70 text-[9px] text-slate-400 font-mono">
            Graph &bull; Heap &bull; Queue &bull; Stack
          </div>
        </div>
      </div>
    </aside>
  );
}
