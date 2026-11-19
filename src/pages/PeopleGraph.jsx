import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraphVisualizer } from '../components/Visualizers/GraphVisualizer';
import {
  Users2,
  UserCheck,
  UserPlus,
  Share2,
  Compass,
  Search,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Info,
  Sparkles
} from 'lucide-react';

export function PeopleGraph() {
  const {
    graph,
    graphVersion,
    currentUserId,
    followUser,
    unfollowUser,
    checkFollowStatus,
    getMutualFollowings
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState('user_khushi');
  const [mutualUserA, setMutualUserA] = useState('user_shravani');
  const [mutualUserB, setMutualUserB] = useState('user_khushi');
  const [lookupFrom, setLookupFrom] = useState('user_shravani');
  const [lookupTo, setLookupTo] = useState('user_saloni');
  const [lookupResult, setLookupResult] = useState(null);

  const vertices = graph.getAllVertices();
  const mutuals = getMutualFollowings(mutualUserA, mutualUserB);

  const handleLookupCheck = (e) => {
    e.preventDefault();
    const doesFollow = checkFollowStatus(lookupFrom, lookupTo);
    setLookupResult({
      from: vertices.find(v => v.id === lookupFrom),
      to: vertices.find(v => v.id === lookupTo),
      doesFollow
    });
  };

  const selectedUserData = vertices.find(v => v.id === selectedUserId);
  const isFollowingSelected = checkFollowStatus(currentUserId, selectedUserId);

  const currentUserData = vertices.find(v => v.id === currentUserId);
  const myFollowing = graph.getFollowing(currentUserId);
  const myFollowers = graph.getFollowers(currentUserId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Follow Network: Directed Graph Module
          </h2>
          <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
            Adjacency List + Hash Sets
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500">
          In Pinterest, follower relationships form an asymmetric directed graph $G = (V, E)$. When Alice follows Bob ($A \to B$), Bob does not automatically follow Alice.
        </p>
      </div>

      {/* Primary Graph Visualization */}
      <div className="mb-8">
        <GraphVisualizer
          graph={graph}
          currentUserId={currentUserId}
          selectedUserId={selectedUserId}
          onSelectUser={(id) => setSelectedUserId(id)}
        />
      </div>

      {/* Interactive Tool Grid: Mutual Followings & O(1) Follow Lookup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Mutual Followings Calculator */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-red-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Mutual Followings Calculator
              </h4>
            </div>
            <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              O(min(dA, dB)) Set Intersection
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Computes $\text{Adj}[A] \cap \text{Adj}[B]$ by iterating through the smaller user adjacency hash set and querying the larger in $O(1)$ time.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">User A</label>
              <select
                value={mutualUserA}
                onChange={(e) => setMutualUserA(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              >
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.handle})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">User B</label>
              <select
                value={mutualUserB}
                onChange={(e) => setMutualUserB(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              >
                {vertices.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.handle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800">
                Mutual Accounts Followed: ({mutuals.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                |Adj[A]|={graph.getFollowing(mutualUserA).length}, |Adj[B]|={graph.getFollowing(mutualUserB).length}
              </span>
            </div>

            {mutuals.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No mutual followings between these two accounts.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {mutuals.map(mId => {
                  const mUser = vertices.find(v => v.id === mId);
                  return (
                    <div
                      key={mId}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold shadow-2xs"
                    >
                      <img
                        src={mUser?.avatar}
                        alt={mUser?.name}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{mUser?.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">({mUser?.handle})</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Directed Edge Follow Lookup */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <h4 className="font-bold text-slate-900 text-sm">
                Directed Edge Search: Does A Follow B?
              </h4>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              O(1) Hash Set Lookup
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            Checks if directed edge $(u, v) \in E$ exists by executing <code className="font-mono text-red-600 font-bold">Adj[u].has(v)</code> in constant average time.
          </p>

          <form onSubmit={handleLookupCheck} className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Source (Does User...)</label>
                <select
                  value={lookupFrom}
                  onChange={(e) => setLookupFrom(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Target (...Follow User?)</label>
                <select
                  value={lookupTo}
                  onChange={(e) => setLookupTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                >
                  {vertices.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Verify Directed Edge (O(1))
            </button>
          </form>

          {lookupResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                lookupResult.doesFollow
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${lookupResult.doesFollow ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                <span>
                  <strong>{lookupResult.from?.name}</strong> {lookupResult.doesFollow ? 'FOLLOWS' : 'DOES NOT follow'} <strong>{lookupResult.to?.name}</strong>
                </span>
              </div>
              <span className="font-mono text-[10px] font-bold">
                {lookupResult.doesFollow ? 'Edge (u,v) = TRUE' : 'Edge (u,v) = FALSE'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Community Users Directory Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Community Creators Directory
            </h3>
            <p className="text-xs text-slate-500">
              Perform real-time Follow and Unfollow operations to see the graph adjacency list update instantly.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {vertices.length} vertices in network
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vertices.map(user => {
            const isMe = user.id === currentUserId;
            const amFollowing = checkFollowStatus(currentUserId, user.id);
            const userFollowers = graph.getFollowers(user.id);
            const userFollowing = graph.getFollowing(user.id);

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-4 rounded-2xl border transition-all text-left bg-white cursor-pointer ${
                  selectedUserId === user.id
                    ? 'border-red-500 ring-2 ring-red-200 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div className="truncate">
                    <h5 className="font-bold text-slate-900 text-sm truncate">{user.name}</h5>
                    <p className="text-[11px] font-mono text-slate-500">{user.handle}</p>
                    <span className="text-[10px] text-red-600 font-semibold">{user.role}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 mb-3 min-h-[32px]">
                  {user.bio}
                </p>

                <div className="flex items-center justify-between py-2 border-y border-gray-100 text-[11px] text-slate-500 mb-3">
                  <span><strong>{userFollowers.length}</strong> followers</span>
                  <span><strong>{userFollowing.length}</strong> following</span>
                </div>

                {isMe ? (
                  <div className="w-full py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold text-center">
                    Your Account (Root Explorer)
                  </div>
                ) : amFollowing ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unfollowUser(user.id);
                    }}
                    className="w-full py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Following (Unfollow)
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      followUser(user.id);
                    }}
                    className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow (O(1))
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
