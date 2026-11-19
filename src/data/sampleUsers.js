/**
 * Sample Users for PinLogic Directed Graph Demonstration
 */
export const SAMPLE_USERS = [
  {
    id: 'user_shravani',
    name: 'Shravani Lohote',
    handle: '@shravani_l',
    role: 'Lead Architect & Designer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'CS Student & UI/UX explorer. Passionate about algorithms and visual discovery engines.',
    boardsCount: 14,
    pinsCount: 182,
    isCurrentUser: true
  },
  {
    id: 'user_khushi',
    name: 'Khushi Chopde',
    handle: '@khushi_c',
    role: 'System Architect',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Distributed systems lover and minimalist interior enthusiast.',
    boardsCount: 9,
    pinsCount: 95,
    isCurrentUser: false
  },
  {
    id: 'user_monika',
    name: 'Monika Limbekar',
    handle: '@monika_l',
    role: 'Graph Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Data structures geek & graphic design curator.',
    boardsCount: 12,
    pinsCount: 130,
    isCurrentUser: false
  },
  {
    id: 'user_saloni',
    name: 'Saloni Limbore',
    handle: '@saloni_algo',
    role: 'Algorithm Analyst',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    bio: 'Analyzing asymptotic bounds by day, saving architectural pins by night.',
    boardsCount: 18,
    pinsCount: 240,
    isCurrentUser: false
  },
  {
    id: 'user_ragini',
    name: 'Ragini Sable',
    handle: '@ragini_s',
    role: 'Complexity Engineer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    bio: 'Algorithms, aesthetic typography, and Scandinavian design.',
    boardsCount: 8,
    pinsCount: 88,
    isCurrentUser: false
  },
  {
    id: 'user_nayana',
    name: 'Nayana Kalaskar',
    handle: '@nayana_k',
    role: 'Data Modeler',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Exploring Pinterest feed ranking algorithms & modern photography.',
    boardsCount: 11,
    pinsCount: 112,
    isCurrentUser: false
  },
  {
    id: 'user_kiran',
    name: 'Kiran Ban',
    handle: '@kiran_b',
    role: 'Data Modeler',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Computer Science enthusiast. Visual computing and heap-based feeds.',
    boardsCount: 7,
    pinsCount: 64,
    isCurrentUser: false
  },
  {
    id: 'user_zeal_design',
    name: 'Zeal Design Studio',
    handle: '@zeal_design',
    role: 'Curated Inspiration',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    bio: 'Official creative showcase for Zeal College of Engineering, Pune.',
    boardsCount: 25,
    pinsCount: 520,
    isCurrentUser: false
  }
];

// Initial directed follow relations: [followerId, followedId] (A follows B)
export const INITIAL_FOLLOW_EDGES = [
  ['user_shravani', 'user_khushi'],
  ['user_shravani', 'user_monika'],
  ['user_shravani', 'user_saloni'],
  ['user_shravani', 'user_zeal_design'],
  ['user_khushi', 'user_shravani'],
  ['user_khushi', 'user_saloni'],
  ['user_khushi', 'user_ragini'],
  ['user_monika', 'user_shravani'],
  ['user_monika', 'user_zeal_design'],
  ['user_saloni', 'user_shravani'],
  ['user_saloni', 'user_khushi'],
  ['user_saloni', 'user_monika'],
  ['user_saloni', 'user_ragini'],
  ['user_ragini', 'user_nayana'],
  ['user_ragini', 'user_kiran'],
  ['user_nayana', 'user_kiran'],
  ['user_nayana', 'user_zeal_design'],
  ['user_kiran', 'user_shravani'],
  ['user_zeal_design', 'user_shravani']
];
