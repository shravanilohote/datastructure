/**
 * Initial sample notifications for FIFO Queue demonstration
 */
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'save',
    icon: 'Bookmark',
    title: 'Pin Saved',
    message: 'Khushi Chopde saved your pin "Minimalist Architecture" to "Modern Spaces".',
    timeAgo: '12m ago',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    read: false,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: 'notif_2',
    type: 'follow',
    icon: 'UserPlus',
    title: 'New Follower',
    message: 'Monika Limbekar started following your design boards.',
    timeAgo: '28m ago',
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    read: false,
    color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  {
    id: 'notif_3',
    type: 'comment',
    icon: 'MessageSquare',
    title: 'New Comment',
    message: 'Saloni Limbore commented: "The lighting contrast on this frame is magnificent!"',
    timeAgo: '1h ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    read: false,
    color: 'bg-amber-50 text-amber-600 border-amber-200'
  },
  {
    id: 'notif_4',
    type: 'invite',
    icon: 'FolderPlus',
    title: 'Board Invitation',
    message: 'Zeal Design Studio invited you to collaborate on "PBL Computer Science Showcase".',
    timeAgo: '2h ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    read: false,
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  {
    id: 'notif_5',
    type: 'publish',
    icon: 'Sparkles',
    title: 'Pin Published',
    message: 'Your pin "Geometric Typography" went live and was indexed into Home Feed Max-Heap.',
    timeAgo: '3h ago',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    read: false,
    color: 'bg-rose-50 text-rose-600 border-rose-200'
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg_1',
    senderId: 'user_khushi',
    senderName: 'Khushi Chopde',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    text: 'Hey Shravani! Have you tested the BFS social distance traversal in our directed graph?',
    timestamp: '10:14 AM',
    isMe: false
  },
  {
    id: 'msg_2',
    senderId: 'user_shravani',
    senderName: 'Shravani Lohote',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Yes! It explores degree-1 (direct followings) and degree-2 connections seamlessly in O(V + E) time.',
    timestamp: '10:16 AM',
    isMe: true
  },
  {
    id: 'msg_3',
    senderId: 'user_saloni',
    senderName: 'Saloni Limbore',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    text: 'Awesome. I also checked the Max-Heap top-K retrieval. Extracting K pins in O(K log n) is significantly faster than sorting 10,000 pins!',
    timestamp: '10:20 AM',
    isMe: false
  },
  {
    id: 'msg_4',
    senderId: 'user_shravani',
    senderName: 'Shravani Lohote',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    text: 'Exactly! Let us make sure our college faculty demo highlights that comparison clearly.',
    timestamp: '10:22 AM',
    isMe: true
  }
];
