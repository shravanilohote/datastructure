import React, { useState } from 'react';
import { X, Bookmark, Heart, MessageSquare, Share2, Sparkles, Binary, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function PinModal({ pin, onClose }) {
  const { enqueueNotification, currentUserId } = useApp();
  const [likes, setLikes] = useState(pin.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([
    {
      id: 'c1',
      author: 'Khushi Chopde',
      text: 'The composition and light grading on this are truly stunning!',
      time: '2h ago'
    },
    {
      id: 'c2',
      author: 'Saloni Limbore',
      text: 'A great candidate for high-ranking heap propagation.',
      time: '1h ago'
    }
  ]);
  const [newComment, setNewComment] = useState('');

  if (!pin) return null;

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      enqueueNotification({
        type: 'comment',
        icon: 'Heart',
        title: 'New Pin Reaction',
        message: `You liked "${pin.title}".`,
        avatar: pin.imageUrl,
        color: 'bg-rose-50 text-rose-600 border-rose-200'
      });
    } else {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        author: 'Shravani Lohote',
        text: newComment.trim(),
        time: 'Just now'
      }
    ]);
    enqueueNotification({
      type: 'comment',
      icon: 'MessageSquare',
      title: 'New Comment Posted',
      message: `You commented on "${pin.title}": "${newComment.trim()}"`,
      avatar: pin.imageUrl,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    });
    setNewComment('');
  };

  // Score breakdown formula
  const savesWeight = 3.5;
  const likesWeight = 2.0;
  const commentsWeight = 1.8;
  const recency = pin.recencyBonus || 25;
  const computedScore = Math.round(
    (pin.saves || 0) * savesWeight + likes * likesWeight + comments.length * commentsWeight + recency
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pin Image (Left) */}
        <div className="md:w-1/2 bg-black flex items-center justify-center relative overflow-hidden">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            className="w-full h-full object-cover max-h-[400px] md:max-h-[85vh]"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-mono font-bold rounded-full">
              Score: {computedScore}
            </span>
          </div>
        </div>

        {/* Pin Content & Engagement (Right) */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-[85vh]">
          <div>
            {/* Top Bar with Board & Save */}
            <div className="flex items-center justify-between mb-4 pr-8">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                {pin.board || 'Discovery'} &bull; {pin.category || 'Visual Art'}
              </span>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition shadow-sm">
                Save Pin
              </button>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
              {pin.title}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {pin.description || 'Discovered through PinLogic multi-factor engagement ranking algorithm.'}
            </p>

            {/* Creator Profile */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl mb-4 border border-gray-100">
              <img
                src={pin.creator?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={pin.creator?.name || 'Creator'}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{pin.creator?.name || 'Curator'}</h4>
                <p className="text-[10px] text-slate-500 font-mono">{pin.creator?.handle || '@creator'}</p>
              </div>
            </div>

            {/* Algorithmic Scoring Breakdown (College Demonstration Focus) */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/80 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <Binary className="w-4 h-4 text-amber-700" />
                <span>Max-Heap Ranking Score Formula</span>
              </div>
              <div className="text-[11px] font-mono text-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span>Saves ({pin.saves || 0} &times; 3.5):</span>
                  <span className="font-bold">{Math.round((pin.saves || 0) * 3.5)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Likes ({likes} &times; 2.0):</span>
                  <span className="font-bold">{Math.round(likes * 2.0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Comments ({comments.length} &times; 1.8):</span>
                  <span className="font-bold">{Math.round(comments.length * 1.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recency Bonus:</span>
                  <span className="font-bold">+{recency}</span>
                </div>
                <div className="pt-1 border-t border-amber-200 flex justify-between text-xs font-bold text-amber-950">
                  <span>Total Composite Score:</span>
                  <span className="text-red-600">{computedScore}</span>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div>
              <h5 className="font-bold text-xs text-slate-800 mb-2">
                Comments ({comments.length})
              </h5>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 mb-3">
                {comments.map(c => (
                  <div key={c.id} className="text-xs p-2 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-700">{c.author}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-slate-700">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  hasLiked ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                {likes}
              </button>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment to update score..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-100 rounded-full border border-transparent focus:border-red-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-full transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
