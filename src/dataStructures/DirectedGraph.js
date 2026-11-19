/**
 * DirectedGraph - Implements a genuine directed graph using Adjacency Lists and Hash Sets.
 * Vertex: User ID (string)
 * Edges: Directed edge (A -> B means A follows B)
 * 
 * Time Complexities:
 * - addVertex: O(1)
 * - addEdge (Follow): O(1) average
 * - removeEdge (Unfollow): O(1) average
 * - hasEdge (Lookup): O(1) average
 * - getFollowing (Outgoing edges): O(deg_out(u))
 * - getFollowers (Incoming edges): O(V) or O(deg_in(u)) with reverse index
 * - mutualFollowings: O(min(dA, dB)) via Set intersection
 * - BFS traversal: O(V + E)
 * - Space: O(V + E)
 */
export class DirectedGraph {
  constructor() {
    // Adjacency list: userId -> Set of userIds they follow (outgoing edges)
    this.adjacencyList = new Map();
    // Reverse adjacency list for O(1) follower tracking (incoming edges)
    this.followersList = new Map();
    // Vertex data registry (user profile info)
    this.vertices = new Map();
  }

  addVertex(id, data = {}) {
    if (!this.adjacencyList.has(id)) {
      this.adjacencyList.set(id, new Set());
      this.followersList.set(id, new Set());
      this.vertices.set(id, { id, ...data });
    } else if (data && Object.keys(data).length > 0) {
      this.vertices.set(id, { ...this.vertices.get(id), ...data });
    }
  }

  getVertex(id) {
    return this.vertices.get(id) || null;
  }

  getAllVertices() {
    return Array.from(this.vertices.values());
  }

  /**
   * Follow: Adds directed edge from `fromId` to `toId`.
   * A -> B means A follows B.
   */
  addEdge(fromId, toId) {
    if (fromId === toId) return false;
    this.addVertex(fromId);
    this.addVertex(toId);

    const following = this.adjacencyList.get(fromId);
    const followers = this.followersList.get(toId);

    if (!following.has(toId)) {
      following.add(toId);
      followers.add(fromId);
      return true;
    }
    return false;
  }

  /**
   * Unfollow: Removes directed edge from `fromId` to `toId`.
   */
  removeEdge(fromId, toId) {
    if (!this.adjacencyList.has(fromId) || !this.followersList.has(toId)) {
      return false;
    }
    const removedFollowing = this.adjacencyList.get(fromId).delete(toId);
    const removedFollower = this.followersList.get(toId).delete(fromId);
    return removedFollowing && removedFollower;
  }

  /**
   * Check if A follows B in O(1)
   */
  hasEdge(fromId, toId) {
    if (!this.adjacencyList.has(fromId)) return false;
    return this.adjacencyList.get(fromId).has(toId);
  }

  /**
   * Get all users that `userId` follows (outgoing edges)
   */
  getFollowing(userId) {
    if (!this.adjacencyList.has(userId)) return [];
    return Array.from(this.adjacencyList.get(userId));
  }

  /**
   * Get all users following `userId` (incoming edges)
   */
  getFollowers(userId) {
    if (!this.followersList.has(userId)) return [];
    return Array.from(this.followersList.get(userId));
  }

  /**
   * Mutual Followings: Find users that BOTH userA and userB follow.
   * Algorithm: Set intersection on the smaller set first.
   * Complexity: O(min(dA, dB)) where dA = |Adj[A]|, dB = |Adj[B]|.
   */
  getMutualFollowing(userAId, userBId) {
    const setA = this.adjacencyList.get(userAId) || new Set();
    const setB = this.adjacencyList.get(userBId) || new Set();

    const mutual = [];
    const [smaller, larger] = setA.size <= setB.size ? [setA, setB] : [setB, setA];

    for (const id of smaller) {
      if (larger.has(id)) {
        mutual.push(id);
      }
    }
    return mutual;
  }

  /**
   * Breadth-First Search (BFS) starting from `startId`.
   * Discovers social network degrees (1st degree = directly followed, 2nd degree = followed by followed, etc.)
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  bfs(startId) {
    if (!this.adjacencyList.has(startId)) return { visitedOrder: [], levels: {}, edgesTraversed: [] };

    const visited = new Set();
    const queue = [startId];
    visited.add(startId);

    const visitedOrder = [];
    const levels = { [startId]: 0 };
    const edgesTraversed = [];

    while (queue.length > 0) {
      const current = queue.shift();
      visitedOrder.push(current);
      const currentLevel = levels[current];

      const neighbors = this.adjacencyList.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          levels[neighbor] = currentLevel + 1;
          queue.push(neighbor);
          edgesTraversed.push({ from: current, to: neighbor, level: currentLevel + 1 });
        }
      }
    }

    return { visitedOrder, levels, edgesTraversed };
  }

  /**
   * Adjacency list representation as a plain object for UI display
   */
  getAdjacencyListObject() {
    const obj = {};
    for (const [id, neighbors] of this.adjacencyList.entries()) {
      obj[id] = Array.from(neighbors);
    }
    return obj;
  }

  getVertexCount() {
    return this.vertices.size;
  }

  getEdgeCount() {
    let count = 0;
    for (const neighbors of this.adjacencyList.values()) {
      count += neighbors.size;
    }
    return count;
  }

  serialize() {
    const data = {
      vertices: Array.from(this.vertices.entries()),
      edges: []
    };
    for (const [from, set] of this.adjacencyList.entries()) {
      for (const to of set) {
        data.edges.push([from, to]);
      }
    }
    return data;
  }

  static deserialize(data) {
    const graph = new DirectedGraph();
    if (!data) return graph;
    if (data.vertices) {
      for (const [id, user] of data.vertices) {
        graph.addVertex(id, user);
      }
    }
    if (data.edges) {
      for (const [from, to] of data.edges) {
        graph.addEdge(from, to);
      }
    }
    return graph;
  }
}
