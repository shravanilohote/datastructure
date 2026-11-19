import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PinCard } from '../components/PinCard';
import { HeapTreeVisualizer } from '../components/Visualizers/HeapTreeVisualizer';
import { WelcomeBanner } from '../components/WelcomeBanner';
import {
  Flame,
  Layers,
  Eye,
  Trash2,
  Filter,
  Plus,
  ArrowUpDown,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function HomeFeed() {
  const {
    maxHeap,
    heapVersion,
    extractMaxPin,
    peekMaxPin,
    getTopKPins,
    topKFilter,
    setTopKFilter,
    insertPinToFeed,
    setActiveTab,
    searchQuery
  } = useApp();

  const [showVisualizer, setShowVisualizer] = useState(true);
  const [peekedPin, setPeekedPin] = useState(null);
  const [extractedPinAlert, setExtractedPinAlert] = useState(null);
  const [selectedK, setSelectedK] = useState(5);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Design');
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Retrieve current heap pins or Top-K subset
  const rawHeapPins = maxHeap.toArray();
  const pinsToDisplay = topKFilter ? getTopKPins(topKFilter) : rawHeapPins;

  // Filter with global search query if present
  const filteredPins = pinsToDisplay.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.creator?.name?.toLowerCase().includes(q) ||
      p.board?.toLowerCase().includes(q)
    );
  });

  const handlePeek = () => {
    const pin = peekMaxPin();
    setPeekedPin(pin);
    setTimeout(() => setPeekedPin(null), 6000);
  };

  const handleExtract = () => {
    const res = extractMaxPin();
    if (res && res.max) {
      setExtractedPinAlert(res.max);
      setTimeout(() => setExtractedPinAlert(null), 6000);
    }
  };

  const handleApplyTopK = (k) => {
    if (topKFilter === k) {
      setTopKFilter(null); // toggle off
    } else {
      setTopKFilter(k);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const randomImages = [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80'
    ];

    const newPin = {
      title: quickTitle.trim(),
      description: 'Quickly seeded test pin to demonstrate O(log n) sift-up heap insertion.',
      imageUrl: randomImages[Math.floor(Math.random() * randomImages.length)],
      creator: {
        id: 'user_shravani',
        name: 'Shravani Lohote',
        handle: '@shravani_l',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      },
      board: quickCategory,
      category: quickCategory,
      saves: Math.floor(Math.random() * 600) + 150,
      likes: Math.floor(Math.random() * 900) + 200,
      comments: Math.floor(Math.random() * 60) + 10,
      recencyBonus: 50
    };

    insertPinToFeed(newPin);
    setQuickTitle('');
    setShowQuickAdd(false);
  };

  const maxRoot = maxHeap.peekMax();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Informative Welcome Banner */}
      <WelcomeBanner />

      {/* Control Bar: Operations & Heap Analytics */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <h2 className="text-base font-bold text-slate-900">
                Personalized Feed Ranking Engine
              </h2>
              <span className="px-2 py-0.5 text-xs font-mono font-bold bg-red-50 text-red-700 border border-red-200 rounded-md">
                Max-Heap DS
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-factor engagement score priority queue. Highest ranked item resides at root (index 0).
            </p>
          </div>

          {/* Quick Heap Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              {showVisualizer ? 'Hide Tree Visualizer' : 'Show Tree Visualizer'}
              {showVisualizer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={handlePeek}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition shadow-2xs"
              title="Inspect Root in O(1)"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Peek Max (O(1))
            </button>

            <button
              onClick={handleExtract}
              disabled={rawHeapPins.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl transition shadow-sm"
              title="Remove root in O(log n) and sift down"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Extract Max (O(log n))
            </button>

            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-black rounded-xl transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              + Add Pin to Heap
            </button>
          </div>
        </div>

        {/* Top-K Selector Bar */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">Top-K Selection:</span>
            <div className="flex items-center gap-1">
              {[3, 5, 8].map(k => (
                <button
                  key={k}
                  onClick={() => handleApplyTopK(k)}
                  className={`px-2.5 py-1 rounded-lg font-mono font-bold transition ${
                    topKFilter === k
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Top {k}
                </button>
              ))}
              {topKFilter && (
                <button
                  onClick={() => setTopKFilter(null)}
                  className="px-2 py-1 text-slate-500 hover:text-slate-800 underline ml-1"
                >
                  Show All ({rawHeapPins.length})
                </button>
              )}
            </div>
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
              O(K log n) extraction complexity
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-[11px] font-mono">
            <span>Root: <strong>{maxRoot ? `${maxRoot.score} pts` : 'Empty'}</strong></span>
            <span>Count: <strong>{pinsToDisplay.length} pins</strong></span>
          </div>
        </div>

        {/* Quick Add Pin Drawer */}
        {showQuickAdd && (
          <form onSubmit={handleQuickAdd} className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-3 animate-fadeIn">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Enter pin title (e.g., Isometric Vector Art)..."
              className="flex-1 min-w-[240px] px-3.5 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <select
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg"
            >
              <option value="Design">Design</option>
              <option value="Architecture">Architecture</option>
              <option value="Photography">Photography</option>
              <option value="Tech">Tech</option>
              <option value="Interiors">Interiors</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition"
            >
              Heap Insert & Sift-Up
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900 underline"
            >
              Or open full Pin Studio (Stack) &rarr;
            </button>
          </form>
        )}
      </div>

      {/* Peek Alert Banner */}
      {peekedPin && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                Peek Max Operation Result &bull; O(1) Time
              </span>
              <p className="text-sm font-semibold text-slate-900">
                Current highest-scoring pin: &ldquo;{peekedPin.title}&rdquo; (Score: {peekedPin.score})
              </p>
              <p className="text-xs text-slate-600">
                Peek accesses root <code className="font-mono text-blue-700">heap[0]</code> immediately without modifying the heap array.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPeekedPin(null)}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Extract Alert Banner */}
      {extractedPinAlert && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Extract Max Operation Completed &bull; O(log n) Time
              </span>
              <p className="text-sm font-semibold text-slate-900">
                Popped root: &ldquo;{extractedPinAlert.title}&rdquo; (Score: {extractedPinAlert.score})
              </p>
              <p className="text-xs text-slate-600">
                Last element was moved to index 0, followed by Sift-Down comparisons to restore the Max-Heap property.
              </p>
            </div>
          </div>
          <button
            onClick={() => setExtractedPinAlert(null)}
            className="text-xs font-bold text-amber-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Interactive Binary Tree & Array Visualizer */}
      {showVisualizer && (
        <div className="mb-6">
          <HeapTreeVisualizer
            maxHeap={maxHeap}
            onExtractMax={handleExtract}
            onPeekMax={handlePeek}
          />
        </div>
      )}

      {/* Feed Section Title */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {topKFilter ? `Top ${topKFilter} Highest Ranked Pins (O(K log n))` : 'Masonry Discovery Stream'}
          </h3>
          <p className="text-xs text-slate-500">
            {topKFilter
              ? `Filtered to the top ${topKFilter} candidates from the Max-Heap priority queue.`
              : 'Ordered directly from the live Max-Heap internal memory.'}
          </p>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-500">
          Showing {filteredPins.length} pins
        </span>
      </div>

      {/* Pinterest Masonry Grid */}
      {filteredPins.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200">
          <p className="text-slate-500 text-sm">No pins match the current filter or search query.</p>
        </div>
      ) : (
        <div className="masonry-grid">
          {filteredPins.map((pin, idx) => (
            <PinCard
              key={pin.id || idx}
              pin={pin}
              isMaxRoot={idx === 0 && !topKFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
