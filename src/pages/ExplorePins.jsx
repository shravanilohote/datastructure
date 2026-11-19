import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PinCard } from '../components/PinCard';
import {
  Compass,
  Sparkles,
  Layers,
  Camera,
  Cpu,
  Home as HomeIcon,
  Palette,
  Leaf,
  Coffee,
  Search
} from 'lucide-react';

export function ExplorePins() {
  const { maxHeap, searchQuery, setSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Categories', icon: Sparkles },
    { id: 'Design', label: 'Graphic & UI/UX', icon: Palette },
    { id: 'Architecture', label: 'Architecture', icon: HomeIcon },
    { id: 'Photography', label: 'Photography', icon: Camera },
    { id: 'Tech', label: 'Computer Science', icon: Cpu },
    { id: 'Interiors', label: 'Minimalist Interiors', icon: HomeIcon },
    { id: 'Nature', label: 'Nature & Botanical', icon: Leaf },
    { id: 'Food', label: 'Culinary Art', icon: Coffee }
  ];

  const allPins = maxHeap.toArray();

  const filteredPins = allPins.filter(pin => {
    const matchesCategory = selectedCategory === 'All' || pin.category === selectedCategory;
    const matchesQuery = !searchQuery || (
      pin.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Visual Exploration & Categorized Discovery
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover visual themes curated by community creators and ranked through our Heap priority queue.
        </p>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-2xs ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-800'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-gray-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.id === 'All'
                  ? allPins.length
                  : allPins.filter(p => p.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Masonry Stream */}
      {filteredPins.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <Compass className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-slate-800 text-sm">No pins found</h4>
          <p className="text-xs text-slate-400 mt-1">
            Try selecting a different category or clearing your search filters.
          </p>
        </div>
      ) : (
        <div className="masonry-grid">
          {filteredPins.map((pin, idx) => (
            <PinCard key={pin.id || idx} pin={pin} />
          ))}
        </div>
      )}
    </div>
  );
}
