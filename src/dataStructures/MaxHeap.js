/**
 * MaxHeap - Implements an authentic Max-Heap data structure for ranking Pinterest Pins.
 * In a Max-Heap, every parent node has a score greater than or equal to its children.
 * Root node at index 0 always contains the highest-scoring Pin.
 * 
 * Array mapping:
 * - Parent: Math.floor((i - 1) / 2)
 * - Left Child: 2 * i + 1
 * - Right Child: 2 * i + 2
 * 
 * Time Complexities:
 * - Peek Max: O(1)
 * - Insert: O(log n)
 * - Extract Max: O(log n)
 * - Build Heap: O(n)
 * - Extract Top-K: O(K log n)
 * - Space: O(n)
 */

export class MaxHeap {
  constructor(initialItems = []) {
    this.heap = [];
    this.lastOperationLogs = [];
    if (initialItems.length > 0) {
      this.buildHeap(initialItems);
    }
  }

  // Calculate demonstrative ranking score
  static calculateScore(pin) {
    const saves = Number(pin.saves || 0);
    const likes = Number(pin.likes || 0);
    const comments = Number(pin.comments || 0);
    const recencyBonus = Number(pin.recencyBonus || 25);
    // Formula reflecting Pinterest engagement value:
    // Saves (High intent) = 3.5x, Likes = 2.0x, Comments = 1.8x, Recency = up to 50
    return Math.round(saves * 3.5 + likes * 2.0 + comments * 1.8 + recencyBonus);
  }

  getScore(item) {
    if (!item) return -Infinity;
    return typeof item.score === 'number' ? item.score : MaxHeap.calculateScore(item);
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  leftChild(i) {
    return 2 * i + 1;
  }

  rightChild(i) {
    return 2 * i + 2;
  }

  swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Peek Max: Returns the highest-scoring Pin without removing it.
   * Time Complexity: O(1)
   */
  peekMax() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Insert a new Pin into the Max-Heap.
   * 1. Append to the end of the array.
   * 2. Sift-Up until heap invariant holds: parent.score >= child.score.
   * Time Complexity: O(log n)
   */
  insert(pin) {
    const preparedPin = {
      ...pin,
      score: this.getScore(pin)
    };

    const logs = [];
    logs.push(`Inserted pin "${preparedPin.title}" with score ${preparedPin.score} at index ${this.heap.length}.`);

    this.heap.push(preparedPin);
    const swapTrail = this.siftUp(this.heap.length - 1, logs);

    this.lastOperationLogs = logs;
    return {
      pin: preparedPin,
      swapTrail,
      logs
    };
  }

  /**
   * Sift-Up helper
   */
  siftUp(index, logs = []) {
    let current = index;
    const swaps = [];

    while (current > 0) {
      const p = this.parent(current);
      if (this.getScore(this.heap[current]) > this.getScore(this.heap[p])) {
        logs.push(
          `Sift-Up: Swap child index ${current} (score ${this.getScore(this.heap[current])}) with parent index ${p} (score ${this.getScore(this.heap[p])}).`
        );
        swaps.push({ from: current, to: p });
        this.swap(current, p);
        current = p;
      } else {
        break;
      }
    }
    if (swaps.length === 0) {
      logs.push(`Sift-Up: Child at index ${current} is <= parent; heap invariant satisfied.`);
    }
    return swaps;
  }

  /**
   * Extract Max: Removes and returns the highest-scoring Pin (root).
   * 1. Save root (max).
   * 2. Move last element to root.
   * 3. Sift-Down until heap invariant holds.
   * Time Complexity: O(log n)
   */
  extractMax() {
    if (this.heap.length === 0) return null;
    const logs = [];

    if (this.heap.length === 1) {
      const max = this.heap.pop();
      logs.push(`Extracted the only pin "${max.title}" (score ${max.score}). Heap is now empty.`);
      this.lastOperationLogs = logs;
      return { max, swapTrail: [], logs };
    }

    const max = this.heap[0];
    const last = this.heap.pop();
    this.heap[0] = last;
    logs.push(`Replaced root with last element "${last.title}" (score ${last.score}). Starting Sift-Down.`);

    const swapTrail = this.siftDown(0, logs);
    this.lastOperationLogs = logs;

    return {
      max,
      swapTrail,
      logs
    };
  }

  /**
   * Sift-Down helper
   */
  siftDown(index, logs = []) {
    let current = index;
    const swaps = [];
    const n = this.heap.length;

    while (this.leftChild(current) < n) {
      let largest = current;
      const left = this.leftChild(current);
      const right = this.rightChild(current);

      if (left < n && this.getScore(this.heap[left]) > this.getScore(this.heap[largest])) {
        largest = left;
      }
      if (right < n && this.getScore(this.heap[right]) > this.getScore(this.heap[largest])) {
        largest = right;
      }

      if (largest !== current) {
        logs.push(
          `Sift-Down: Swap node index ${current} (score ${this.getScore(this.heap[current])}) with larger child index ${largest} (score ${this.getScore(this.heap[largest])}).`
        );
        swaps.push({ from: current, to: largest });
        this.swap(current, largest);
        current = largest;
      } else {
        logs.push(`Sift-Down: Node at index ${current} is >= all children. Heap invariant satisfied.`);
        break;
      }
    }
    return swaps;
  }

  /**
   * Build Heap in O(n) from an arbitrary array using bottom-up sift-downs.
   */
  buildHeap(items) {
    this.heap = items.map(item => ({
      ...item,
      score: this.getScore(item)
    }));
    const logs = [];
    logs.push(`Building heap from ${this.heap.length} items using bottom-up heapify in O(n).`);

    const startIdx = Math.floor(this.heap.length / 2) - 1;
    for (let i = startIdx; i >= 0; i--) {
      this.siftDown(i, logs);
    }
    this.lastOperationLogs = logs;
  }

  /**
   * Retrieve the Top K highest-scoring Pins.
   * Clones heap and performs K extractMax calls.
   * Time Complexity: O(K log n)
   */
  getTopK(k) {
    const kBounded = Math.min(Math.max(1, k), this.heap.length);
    // Clone heap array
    const tempHeap = new MaxHeap(this.heap.map(p => ({ ...p })));
    const topK = [];

    for (let i = 0; i < kBounded; i++) {
      const res = tempHeap.extractMax();
      if (res && res.max) {
        topK.push(res.max);
      }
    }
    return topK;
  }

  /**
   * Returns array representation of current heap
   */
  toArray() {
    return [...this.heap];
  }

  /**
   * Returns tree node representation for SVG / visualization rendering
   */
  getTreeNodes() {
    return this.heap.map((item, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const totalInLevel = Math.pow(2, level);
      const parentIdx = index > 0 ? this.parent(index) : null;
      const leftIdx = this.leftChild(index) < this.heap.length ? this.leftChild(index) : null;
      const rightIdx = this.rightChild(index) < this.heap.length ? this.rightChild(index) : null;

      return {
        item,
        index,
        score: this.getScore(item),
        level,
        positionInLevel,
        totalInLevel,
        parentIdx,
        leftIdx,
        rightIdx,
        isRoot: index === 0
      };
    });
  }

  serialize() {
    return this.heap;
  }

  static deserialize(arr) {
    const mh = new MaxHeap();
    if (Array.isArray(arr)) {
      mh.buildHeap(arr);
    }
    return mh;
  }
}
