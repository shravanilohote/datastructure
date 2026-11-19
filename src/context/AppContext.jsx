import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DirectedGraph } from '../dataStructures/DirectedGraph';
import { MaxHeap } from '../dataStructures/MaxHeap';
import { FifoQueue, DoublyLinkedList } from '../dataStructures/FifoQueue';
import { UndoRedoManager } from '../dataStructures/UndoRedoStack';
import { SAMPLE_USERS, INITIAL_FOLLOW_EDGES } from '../data/sampleUsers';
import { SAMPLE_PINS } from '../data/samplePins';
import { INITIAL_NOTIFICATIONS, INITIAL_CHAT_MESSAGES } from '../data/sampleNotifications';
import confetti from 'canvas-confetti';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPinModal, setSelectedPinModal] = useState(null);

  // 1. DIRECTED GRAPH STATE
  const [graph, setGraph] = useState(() => {
    const saved = localStorage.getItem('pinlogic_graph');
    if (saved) {
      try {
        return DirectedGraph.deserialize(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse graph from storage', e);
      }
    }
    const g = new DirectedGraph();
    SAMPLE_USERS.forEach(u => g.addVertex(u.id, u));
    INITIAL_FOLLOW_EDGES.forEach(([from, to]) => g.addEdge(from, to));
    return g;
  });

  // Graph version counter to force reactivity on mutation
  const [graphVersion, setGraphVersion] = useState(0);
  const currentUserId = 'user_shravani'; // Default authenticated user

  // Save graph to localStorage on update
  useEffect(() => {
    localStorage.setItem('pinlogic_graph', JSON.stringify(graph.serialize()));
  }, [graph, graphVersion]);

  // Graph operations
  const followUser = (toId) => {
    const changed = graph.addEdge(currentUserId, toId);
    if (changed) {
      setGraphVersion(v => v + 1);
      // Enqueue notification to user
      const targetUser = graph.getVertex(toId);
      if (targetUser) {
        enqueueNotification({
          type: 'follow',
          icon: 'UserPlus',
          title: 'You followed a creator',
          message: `You started following ${targetUser.name} (${targetUser.handle}).`,
          avatar: targetUser.avatar,
          color: 'bg-blue-50 text-blue-600 border-blue-200'
        });
      }
    }
    return changed;
  };

  const unfollowUser = (toId) => {
    const changed = graph.removeEdge(currentUserId, toId);
    if (changed) {
      setGraphVersion(v => v + 1);
    }
    return changed;
  };

  const checkFollowStatus = (fromId, toId) => {
    return graph.hasEdge(fromId, toId);
  };

  const getMutualFollowings = (userAId, userBId) => {
    return graph.getMutualFollowing(userAId, userBId);
  };

  const runGraphBFS = (startId) => {
    return graph.bfs(startId);
  };

  // 2. MAX-HEAP HOME FEED STATE
  const [maxHeap, setMaxHeap] = useState(() => {
    const saved = localStorage.getItem('pinlogic_heap');
    if (saved) {
      try {
        const arr = JSON.parse(saved);
        return MaxHeap.deserialize(arr);
      } catch (e) {
        console.error('Failed to parse heap from storage', e);
      }
    }
    return new MaxHeap(SAMPLE_PINS);
  });

  const [heapVersion, setHeapVersion] = useState(0);
  const [topKFilter, setTopKFilter] = useState(null); // null means full heap, number means Top-K
  const [lastHeapOp, setLastHeapOp] = useState(null);

  useEffect(() => {
    localStorage.setItem('pinlogic_heap', JSON.stringify(maxHeap.serialize()));
  }, [maxHeap, heapVersion]);

  const insertPinToFeed = (newPin) => {
    const calculatedScore = MaxHeap.calculateScore(newPin);
    const pinWithScore = {
      ...newPin,
      id: newPin.id || `pin_${Date.now()}`,
      score: calculatedScore,
      createdAt: 'Just now'
    };

    const res = maxHeap.insert(pinWithScore);
    setHeapVersion(v => v + 1);
    setLastHeapOp({ type: 'insert', result: res });

    // Also push a notification into the FIFO queue
    enqueueNotification({
      type: 'publish',
      icon: 'Sparkles',
      title: 'New Pin Published & Ranked',
      message: `"${pinWithScore.title}" added to Max-Heap with ranking score ${pinWithScore.score}.`,
      avatar: pinWithScore.imageUrl,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    });

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (_) {}

    return pinWithScore;
  };

  const extractMaxPin = () => {
    const res = maxHeap.extractMax();
    if (res) {
      setHeapVersion(v => v + 1);
      setLastHeapOp({ type: 'extract', result: res });
    }
    return res;
  };

  const peekMaxPin = () => {
    return maxHeap.peekMax();
  };

  const getTopKPins = (k) => {
    return maxHeap.getTopK(k);
  };

  // 3. FIFO NOTIFICATIONS QUEUE STATE
  const [notificationQueue, setNotificationQueue] = useState(() => {
    const saved = localStorage.getItem('pinlogic_notifications');
    if (saved) {
      try {
        return FifoQueue.deserialize(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse queue', e);
      }
    }
    const q = new FifoQueue();
    INITIAL_NOTIFICATIONS.forEach(n => q.enqueue(n));
    return q;
  });

  const [queueVersion, setQueueVersion] = useState(0);
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem('pinlogic_unread');
    return saved ? parseInt(saved, 10) : INITIAL_NOTIFICATIONS.length;
  });

  useEffect(() => {
    localStorage.setItem('pinlogic_notifications', JSON.stringify(notificationQueue.serialize()));
    localStorage.setItem('pinlogic_unread', unreadCount.toString());
  }, [notificationQueue, queueVersion, unreadCount]);

  const enqueueNotification = (item) => {
    notificationQueue.enqueue(item);
    setUnreadCount(prev => prev + 1);
    setQueueVersion(v => v + 1);
  };

  const dequeueNotification = () => {
    const removed = notificationQueue.dequeue();
    if (removed) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      setQueueVersion(v => v + 1);
    }
    return removed;
  };

  const markAllNotificationsRead = () => {
    setUnreadCount(0);
  };

  // Doubly Linked List for Chat History
  const [chatList, setChatList] = useState(() => DoublyLinkedList.fromArray(INITIAL_CHAT_MESSAGES));
  const [chatVersion, setChatVersion] = useState(0);

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    chatList.append({
      senderId: currentUserId,
      senderName: 'Shravani Lohote',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      text: text.trim(),
      isMe: true
    });
    setChatVersion(v => v + 1);
  };

  // Reset demo data helper
  const resetDemoData = () => {
    localStorage.removeItem('pinlogic_graph');
    localStorage.removeItem('pinlogic_heap');
    localStorage.removeItem('pinlogic_notifications');
    localStorage.removeItem('pinlogic_unread');
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        // Navigation & Global UI
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedPinModal,
        setSelectedPinModal,
        currentUserId,
        resetDemoData,

        // Graph
        graph,
        graphVersion,
        followUser,
        unfollowUser,
        checkFollowStatus,
        getMutualFollowings,
        runGraphBFS,

        // Max-Heap
        maxHeap,
        heapVersion,
        insertPinToFeed,
        extractMaxPin,
        peekMaxPin,
        getTopKPins,
        topKFilter,
        setTopKFilter,
        lastHeapOp,

        // FIFO Queue
        notificationQueue,
        queueVersion,
        unreadCount,
        enqueueNotification,
        dequeueNotification,
        markAllNotificationsRead,

        // Chat Doubly Linked List
        chatList,
        chatVersion,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
