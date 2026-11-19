import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QueueVisualizer } from '../components/Visualizers/QueueVisualizer';
import { ChatDoublyLinkedList } from '../components/Visualizers/ChatDoublyLinkedList';
import {
  Bell,
  CheckCircle2,
  Bookmark,
  UserPlus,
  MessageSquare,
  FolderPlus,
  Sparkles,
  Send,
  FastForward,
  Trash2,
  Clock,
  Layers
} from 'lucide-react';

export function NotificationsQueue() {
  const {
    notificationQueue,
    queueVersion,
    unreadCount,
    enqueueNotification,
    dequeueNotification,
    markAllNotificationsRead,
    chatList,
    chatVersion,
    sendChatMessage,
    currentUserId
  } = useApp();

  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' or 'chat'
  const items = notificationQueue.toArray();

  const handleSimulateEvent = (type) => {
    const templates = {
      save: {
        type: 'save',
        icon: 'Bookmark',
        title: 'Pin Saved',
        message: 'A creator saved your latest architectural snapshot to "Modern Design".',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
      },
      follow: {
        type: 'follow',
        icon: 'UserPlus',
        title: 'New Follower',
        message: 'Kiran Ban started following your graph discovery boards.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        color: 'bg-blue-50 text-blue-600 border-blue-200'
      },
      comment: {
        type: 'comment',
        icon: 'MessageSquare',
        title: 'New Pin Comment',
        message: 'Nayana Kalaskar: "The color palette here matches the Pinterest design system perfectly."',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        color: 'bg-amber-50 text-amber-600 border-amber-200'
      },
      invite: {
        type: 'invite',
        icon: 'FolderPlus',
        title: 'Board Invitation',
        message: 'Zeal Design Studio invited you to co-author "Engineering Research 2026".',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        color: 'bg-purple-50 text-purple-600 border-purple-200'
      },
      publish: {
        type: 'publish',
        icon: 'Sparkles',
        title: 'New Pin Published',
        message: 'Your pin was scored by the ranking algorithm and placed into the Max-Heap.',
        avatar: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&auto=format&fit=crop&q=80',
        color: 'bg-rose-50 text-rose-600 border-rose-200'
      }
    };

    const chosen = templates[type] || templates.save;
    enqueueNotification(chosen);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'save': return <Bookmark className="w-4 h-4 text-emerald-600" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'invite': return <FolderPlus className="w-4 h-4 text-purple-600" />;
      default: return <Sparkles className="w-4 h-4 text-rose-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Event Stream: FIFO Queue & Doubly Linked List
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
            FIFO Buffer + Doubly Linked History
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          Pinterest notification delivery pipelines enqueue user events in chronological First-In First-Out order. Chat logs maintain bidirectional pointers for instant history navigation.
        </p>
      </div>

      {/* Primary FIFO Queue Conveyor Visualization */}
      <div className="mb-8">
        <QueueVisualizer
          queue={notificationQueue}
          onDequeue={dequeueNotification}
          onEnqueueSample={() => handleSimulateEvent('save')}
        />
      </div>

      {/* Simulator Event Triggers */}
      <div className="bg-white rounded-2xl border border-gray-200/90 p-4 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              Simulate Real-Time Pinterest Events (Enqueue at Rear &bull; O(1))
            </h4>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
              >
                Mark all read ({unreadCount})
              </button>
            )}
            <button
              onClick={dequeueNotification}
              disabled={items.length === 0}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs disabled:opacity-40"
            >
              <FastForward className="w-3.5 h-3.5" />
              Process Oldest (Dequeue Front)
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSimulateEvent('save')}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
            + Pin Saved Event
          </button>
          <button
            onClick={() => handleSimulateEvent('follow')}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            + New Follower Event
          </button>
          <button
            onClick={() => handleSimulateEvent('comment')}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            + New Comment Event
          </button>
          <button
            onClick={() => handleSimulateEvent('invite')}
            className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5 text-purple-600" />
            + Board Invitation Event
          </button>
          <button
            onClick={() => handleSimulateEvent('publish')}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            + Pin Published Event
          </button>
        </div>
      </div>

      {/* Split Section: Chronological Notifications List & Doubly Linked List Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: FIFO Notifications Inbox */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                Chronological FIFO Inbox ({items.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              Front &rarr; Rear
            </span>
          </div>

          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs">Your notification inbox is clean.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {items.map((notif, idx) => {
                const isFront = idx === 0;
                const isRear = idx === items.length - 1;

                return (
                  <div
                    key={notif.id || idx}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isFront
                        ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-200'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="p-2 bg-white rounded-xl shadow-2xs flex-shrink-0">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h5 className="font-bold text-slate-900 text-xs truncate">
                          {notif.title}
                        </h5>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                          {notif.timeAgo || 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        {notif.message}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-slate-400">
                          Queue position: #{idx} {isFront ? '(Next to dequeue)' : isRear ? '(Latest arrival)' : ''}
                        </span>
                        {isFront && (
                          <button
                            onClick={dequeueNotification}
                            className="text-blue-700 font-bold hover:underline"
                          >
                            Dismiss Oldest
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Doubly Linked List Chat Stream */}
        <div className="lg:col-span-7">
          <ChatDoublyLinkedList
            chatList={chatList}
            onSendMessage={sendChatMessage}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
