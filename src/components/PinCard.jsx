import React, { useState } from 'react';
import { Bookmark, Heart, MessageSquare, Share2, Flame, Award, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function PinCard({ pin, isMaxRoot = false }) {
  const { setSelectedPinModal, enqueueNotification } = useApp();
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(pin.saves || 0);

  const handleSave = (e) => {
    e.stopPropagation();
    if (!isSaved) {
      setIsSaved(true);
      setSaveCount(prev => prev + 1);
      enqueueNotification({
        type: 'save',
        icon: 'Bookmark',
        title: 'Pin Saved to Profile',
        message: `You saved "${pin.title}" to your primary collection.`,
        avatar: pin.imageUrl,
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
      });
    } else {
      setIsSaved(false);
      setSaveCount(prev => prev - 1);
    }
  };

  return (
    <div
      onClick={() => setSelectedPinModal(pin)}
      className="break-inside-avoid mb-5 group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-pin-hover group-hover:-translate-y-1">
        {/* Max Root Ribbon */}
        {isMaxRoot && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
            <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
            Max-Heap #1
          </div>
        )}

        {/* Engagement Score Badge */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md text-white rounded-full text-[11px] font-mono font-bold shadow-sm">
          <span>Score:</span>
          <span className="text-amber-400 font-black">{pin.score}</span>
        </div>

        {/* Pin Image */}
        <img
          src={pin.imageUrl}
          alt={pin.title}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5 z-10 pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 ${
                isSaved
                  ? 'bg-slate-900 text-white hover:bg-black'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>

          <div className="flex items-center justify-between pointer-events-auto">
            <div className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-medium text-slate-800 shadow-sm">
              {pin.board || 'Visual Arts'}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard?.writeText(window.location.href);
                }}
                className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-800 flex items-center justify-center shadow-sm transition"
                title="Copy Link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Below Image */}
      <div className="pt-2 px-1">
        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {pin.title}
        </h4>

        {/* Creator and Engagement Row */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 truncate">
            <img
              src={pin.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
              alt={pin.creator?.name || 'Creator'}
              className="w-5 h-5 rounded-full object-cover flex-shrink-0"
            />
            <span className="text-xs text-slate-600 font-medium truncate">
              {pin.creator?.name || 'Creator'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono flex-shrink-0">
            <span className="flex items-center gap-0.5">
              <Bookmark className="w-3 h-3 text-red-500" />
              {saveCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 text-rose-500" />
              {pin.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
