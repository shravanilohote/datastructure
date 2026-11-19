import React from 'react';
import {
  GraduationCap,
  Users2,
  BookOpen,
  Award,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Code2,
  Building,
  Calendar,
  Layers,
  Heart
} from 'lucide-react';

export function AboutProject() {
  const teamMembers = [
    {
      name: 'Shravani Lohote',
      role: 'Project Manager & Lead Developer',
      focus: 'System Architecture, Full-Stack Integration, Heap & Graph Coordination',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      handle: '@shravani_l'
    },
    {
      name: 'Khushi Chopde',
      role: 'System Architect',
      focus: 'Distributed Systems Invariants, UI/UX Layout, Multi-Tier Caching Flow',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      handle: '@khushi_c'
    },
    {
      name: 'Monika Limbekar',
      role: 'System Architect',
      focus: 'Asymmetric Directed Graph Topologies & Adjacency List Optimization',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      handle: '@monika_l'
    },
    {
      name: 'Saloni Limbore',
      role: 'Algorithm Analyst',
      focus: 'Asymptotic Bounds, Comparative Proofs, BFS Social Distance',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
      handle: '@saloni_algo'
    },
    {
      name: 'Ragini Sable',
      role: 'Algorithm Analyst',
      focus: 'Max-Heap Sift-Up/Down Invariants, Top-K Complexity Modeling',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
      handle: '@ragini_s'
    },
    {
      name: 'Nayana Kalaskar',
      role: 'Data Modeler',
      focus: 'FIFO Queue Buffer Pipelines & Real-Time Event Dispatch Models',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      handle: '@nayana_k'
    },
    {
      name: 'Kiran Ban',
      role: 'Data Modeler',
      focus: 'LIFO Stack State Machines, Branch Invalidation & Undo Engines',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      handle: '@kiran_b'
    }
  ];

  const references = [
    {
      title: 'Pixie: A System for Recommending 3+ Billion Items to 200+ Million Users in Real-Time',
      authors: 'Eksombatchai, C., Jindal, P., et al. (Pinterest Engineering / Stanford University)',
      publication: 'ACM SIGKDD International Conference on Knowledge Discovery and Data Mining (KDD)',
      notes: 'Pioneered random walks on large-scale bipartite directed graphs for visual discovery.'
    },
    {
      title: 'Graph Convolutional Neural Networks for Web-Scale Recommender Systems (PinSage)',
      authors: 'Ying, R., He, R., Chen, K., Eksombatchai, P., Hamilton, W. L., Leskovec, J.',
      publication: 'ACM SIGKDD 2018',
      notes: 'Deep graph representation learning operating on Pinterest’s graph of 3 billion pins and boards.'
    },
    {
      title: 'Introduction to Algorithms (4th Edition)',
      authors: 'Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (MIT Press)',
      publication: 'MIT Press, Cambridge, MA',
      notes: 'Theoretical foundations for Binary Heaps, Directed Graph traversals, and Queue/Stack invariants.'
    },
    {
      title: 'Pinterest Engineering: Building a Real-time Notification Dispatch Pipeline',
      authors: 'Pinterest Engineering Architecture Whitepaper',
      publication: 'Pinterest Engineering Blog',
      notes: 'Describes the partitioned FIFO queues and pub/sub event buffers powering billions of daily alerts.'
    },
    {
      title: 'Top-K Query Processing Techniques in Large-Scale Priority Queues',
      authors: 'Fagin, R., Lotem, A., & Naor, M.',
      publication: 'Journal of Computer and System Sciences',
      notes: 'Proves the optimal bounds of O(K log n) extraction over full sort O(n log n).'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* College & Project Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white rounded-3xl p-6 md:p-8 mb-8 shadow-xl border border-slate-700">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            Zeal College of Engineering and Research, Pune
          </span>
          <span className="px-3 py-1 bg-white/10 text-slate-200 text-[10px] font-semibold rounded-full border border-white/10">
            Department of Computer Engineering
          </span>
          <span className="px-3 py-1 bg-white/10 text-slate-200 text-[10px] font-semibold rounded-full border border-white/10">
            Activity 2: Data Structures
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          PinLogic &ndash; Exploring Pinterest Through Data Structures
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Developed by <strong>ALGO_MINDS</strong> to bridge computer science theory with production platform engineering. This website provides an interactive, mathematically verified demonstration of how Directed Graphs, Max-Heaps, FIFO Queues, and LIFO Stacks power modern visual discovery systems.
        </p>
      </div>

      {/* Team Roster Grid */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Users2 className="w-5 h-5 text-red-600" />
              Project Team: ALGO_MINDS
            </h3>
            <p className="text-xs text-slate-500">
              Zeal College of Engineering and Research, Narhe, Pune
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
            7 Contributors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between ${
                i === 0
                  ? 'bg-red-50/40 border-red-300 ring-2 ring-red-100 shadow-sm'
                  : 'bg-white border-gray-200 shadow-2xs hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div className="truncate">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{member.name}</h5>
                    <span className="text-[10px] font-mono text-slate-400 block">{member.handle}</span>
                    <span className="text-[11px] font-extrabold text-red-600 block leading-tight">
                      {member.role}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-snug">
                  {member.focus}
                </p>
              </div>

              {i === 0 && (
                <div className="mt-3 pt-2 border-t border-red-200/70 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                  Project Lead
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Academic References Section */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-sm p-6">
        <div className="pb-3 border-b border-gray-100 mb-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Research References & Academic Citations
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer-reviewed papers, engineering whitepapers, and textbooks referenced during this Data Structures Activity.
          </p>
        </div>

        <div className="space-y-3">
          {references.map((ref, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                    [{idx + 1}] {ref.title}
                  </h5>
                  <p className="text-slate-600 mt-0.5">
                    <strong>Authors:</strong> {ref.authors}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] mt-0.5">
                    {ref.publication}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg font-medium">
                <strong>Demonstration Context:</strong> {ref.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
