import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { UndoRedoManager } from '../dataStructures/UndoRedoStack';
import { StackVisualizer } from '../components/Visualizers/StackVisualizer';
import {
  Upload,
  Undo2,
  Redo2,
  Type,
  Sliders,
  Crop,
  Smile,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers,
  Award,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_CANVAS_IMAGES = [
  {
    name: 'Brutalist Architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Minimal Workspace',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Tokyo Neon Night',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Nordic Ceramics',
    url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80'
  }
];

const INITIAL_STATE = {
  imageUrl: SAMPLE_CANVAS_IMAGES[0].url,
  imageName: SAMPLE_CANVAS_IMAGES[0].name,
  text: 'Visual Discovery 2026',
  textColor: '#ffffff',
  textSize: 24,
  textPosition: 'bottom', // 'top', 'center', 'bottom'
  filter: 'none', // 'none', 'grayscale', 'sepia', 'contrast', 'vintage', 'blur'
  aspectRatio: 'aspect-[3/4]', // 'aspect-square', 'aspect-[3/4]', 'aspect-[9/16]'
  badge: '⭐ Trending Pin',
  title: 'Curated Architectural Geometry',
  board: 'Design Architecture',
  category: 'Design'
};

export function CreatePinStack() {
  const { insertPinToFeed, setActiveTab } = useApp();

  // Instantiate UndoRedoManager in ref to persist between renders
  const managerRef = useRef(new UndoRedoManager(INITIAL_STATE));
  const [managerVersion, setManagerVersion] = useState(0);
  const [publishedSuccess, setPublishedSuccess] = useState(null);

  const currentState = managerRef.current.getCurrentState() || INITIAL_STATE;
  const canUndo = managerRef.current.canUndo();
  const canRedo = managerRef.current.canRedo();
  const undoView = managerRef.current.getUndoStackView();
  const redoView = managerRef.current.getRedoStackView();
  const logs = managerRef.current.getLogs();

  // Mutation helper: pushes new state onto Undo stack and purges Redo stack
  const applyEdit = (description, changes) => {
    const newState = { ...currentState, ...changes };
    managerRef.current.recordAction(description, newState);
    setManagerVersion(v => v + 1);
  };

  const handleUndo = () => {
    managerRef.current.undo();
    setManagerVersion(v => v + 1);
  };

  const handleRedo = () => {
    managerRef.current.redo();
    setManagerVersion(v => v + 1);
  };

  const handleSelectImage = (img) => {
    applyEdit(`Selected Image: ${img.name}`, {
      imageUrl: img.url,
      imageName: img.name
    });
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        applyEdit(`Uploaded Custom Image: ${file.name}`, {
          imageUrl: event.target.result,
          imageName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    const pinPayload = {
      title: currentState.title || 'Untitled Pin',
      description: `Created via Pin Studio with filter: ${currentState.filter}, badge: ${currentState.badge}.`,
      imageUrl: currentState.imageUrl,
      creator: {
        id: 'user_shravani',
        name: 'Shravani Lohote',
        handle: '@shravani_l',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
      },
      board: currentState.board,
      category: currentState.category,
      saves: 120,
      likes: 210,
      comments: 15,
      recencyBonus: 50
    };

    const published = insertPinToFeed(pinPayload);
    setPublishedSuccess(published);

    try {
      confetti({ particleCount: 75, spread: 80, origin: { y: 0.7 } });
    } catch (_) {}
  };

  // Filter styling mapping
  const getFilterStyle = (f) => {
    switch (f) {
      case 'grayscale': return 'grayscale';
      case 'sepia': return 'sepia';
      case 'contrast': return 'contrast-150 brightness-110';
      case 'vintage': return 'sepia-[.4] contrast-125 saturate-150';
      case 'blur': return 'blur-[1.5px]';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Pin Creation Studio: LIFO Stack Module
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-md">
            Last-In First-Out State Machine
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Every edit pushes a snapshot onto the Undo Stack in $O(1)$ time. Undoing pops to the Redo Stack. Any new modification resets Redo history to avoid state diverging.
        </p>
      </div>

      {/* Main Stack Visualizer Component */}
      <div className="mb-8">
        <StackVisualizer
          undoStackView={undoView}
          redoStackView={redoView}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          logs={logs}
        />
      </div>

      {/* Success Publish Notification */}
      {publishedSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Pin Published to Max-Heap!
              </span>
              <p className="text-sm font-semibold text-slate-900">
                &ldquo;{publishedSuccess.title}&rdquo; was inserted into the live Home Feed Heap with score {publishedSuccess.score}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            View in Feed <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Pin Studio: Interactive Canvas & Tool Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Live Canvas (Left) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Live Canvas State
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="p-1.5 rounded-lg border text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition"
                  title="Undo (O(1))"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="p-1.5 rounded-lg border text-slate-700 hover:bg-slate-100 disabled:opacity-30 transition"
                  title="Redo (O(1))"
                >
                  <Redo2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Frame */}
            <div className="relative mx-auto max-w-[340px] rounded-2xl overflow-hidden shadow-pin bg-black group select-none">
              <img
                src={currentState.imageUrl}
                alt={currentState.imageName}
                className={`w-full object-cover transition-all duration-300 ${currentState.aspectRatio} ${getFilterStyle(currentState.filter)}`}
              />

              {/* Decorative Badge Overlay */}
              {currentState.badge && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold shadow-md">
                  {currentState.badge}
                </div>
              )}

              {/* Custom Text Overlay */}
              {currentState.text && (
                <div
                  className={`absolute left-0 right-0 px-4 z-10 flex ${
                    currentState.textPosition === 'top'
                      ? 'top-10 justify-center'
                      : currentState.textPosition === 'center'
                      ? 'top-1/2 -translate-y-1/2 justify-center'
                      : 'bottom-4 justify-center'
                  }`}
                >
                  <span
                    style={{
                      color: currentState.textColor,
                      fontSize: `${currentState.textSize}px`
                    }}
                    className="font-extrabold text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tracking-tight leading-tight px-2 py-1 rounded bg-black/20 backdrop-blur-2xs"
                  >
                    {currentState.text}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] font-mono text-slate-600 flex justify-between">
              <span>Filter: <strong>{currentState.filter}</strong></span>
              <span>Ratio: <strong>{currentState.aspectRatio}</strong></span>
              <span>Font: <strong>{currentState.textSize}px</strong></span>
            </div>
          </div>
        </div>

        {/* Studio Controls (Right) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Image Selector & Upload */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-red-600" />
              1. Base Image Selection
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {SAMPLE_CANVAS_IMAGES.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectImage(img)}
                  className={`p-1 rounded-xl border transition overflow-hidden text-left ${
                    currentState.imageUrl === img.url
                      ? 'border-red-600 ring-2 ring-red-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-16 object-cover rounded-lg"
                  />
                  <span className="text-[10px] font-medium text-slate-700 truncate block mt-1">
                    {img.name}
                  </span>
                </button>
              ))}
            </div>

            <label className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-gray-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              Upload Custom Image File
              <input
                type="file"
                accept="image/*"
                onChange={handleCustomUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* 2. Text Overlays */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              2. Text Overlays & Typography
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Overlay Caption</label>
                <input
                  type="text"
                  value={currentState.text}
                  onChange={(e) => applyEdit(`Changed Text to "${e.target.value}"`, { text: e.target.value })}
                  placeholder="Enter overlay text..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Position</label>
                <div className="flex gap-1">
                  {['top', 'center', 'bottom'].map(pos => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => applyEdit(`Positioned text at ${pos}`, { textPosition: pos })}
                      className={`flex-1 py-1.5 text-xs font-bold capitalize rounded-lg border transition ${
                        currentState.textPosition === pos
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Font Size ({currentState.textSize}px)
                </label>
                <input
                  type="range"
                  min="16"
                  max="42"
                  value={currentState.textSize}
                  onChange={(e) => applyEdit(`Set font size ${e.target.value}px`, { textSize: Number(e.target.value) })}
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Text Color</label>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#000000', '#facc15', '#f43f5e', '#38bdf8'].map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => applyEdit(`Color changed to ${color}`, { textColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        currentState.textColor === color ? 'border-red-600 scale-110 shadow-sm' : 'border-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Filters, Aspect Ratio & Stickers */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-600" />
              3. Visual Filters & Canvas Aspect Ratio
            </h4>

            {/* Filters */}
            <div className="mb-3">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Photo Preset Filter</label>
              <div className="flex flex-wrap gap-1.5">
                {['none', 'grayscale', 'sepia', 'contrast', 'vintage', 'blur'].map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => applyEdit(`Applied filter: ${f}`, { filter: f })}
                    className={`px-3 py-1 text-xs font-semibold capitalize rounded-lg border transition ${
                      currentState.filter === f
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="mb-3">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Aspect Ratio (Crop Format)</label>
              <div className="flex gap-2">
                {[
                  { id: 'aspect-square', label: '1:1 Square' },
                  { id: 'aspect-[3/4]', label: '3:4 Standard Pin' },
                  { id: 'aspect-[9/16]', label: '9:16 Tall Story' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => applyEdit(`Aspect ratio set to ${r.label}`, { aspectRatio: r.id })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                      currentState.aspectRatio === r.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decorative Badges / Stickers */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Sticker / Badge</label>
              <div className="flex flex-wrap gap-2">
                {['⭐ Trending Pin', '📌 Must Try', '❤️ Loved Choice', '🔥 Hot Idea', '💡 Pro Tip', ''].map((badge, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyEdit(badge ? `Added badge "${badge}"` : 'Removed badge', { badge })}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                      currentState.badge === badge
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {badge || 'None'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Publish Pin to Heap Form */}
          <form onSubmit={handlePublish} className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-400" />
                <h4 className="font-bold text-sm">Publish Pin to Heap Discovery Feed</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                O(log n) Heap Insertion
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Pin Title</label>
                <input
                  type="text"
                  value={currentState.title}
                  onChange={(e) => applyEdit(`Set title: ${e.target.value}`, { title: e.target.value })}
                  placeholder="Enter Pin Title..."
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Category & Board</label>
                <select
                  value={currentState.category}
                  onChange={(e) => applyEdit(`Category set to ${e.target.value}`, { category: e.target.value, board: `${e.target.value} Inspiration` })}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Design">Design</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Photography">Photography</option>
                  <option value="Tech">Tech</option>
                  <option value="Interiors">Interiors</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Publish Pin & Rank in Max-Heap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
