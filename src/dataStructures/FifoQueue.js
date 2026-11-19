/**
 * FifoQueue - Genuine First-In First-Out Queue implementation with explicit Front and Rear tracking.
 * Used for Pinterest real-time notification streams and event ingestion pipelines.
 * 
 * Time Complexities:
 * - Enqueue: O(1)
 * - Dequeue: O(1)
 * - Peek Front: O(1)
 * - Read unread counter: O(1)
 * - Space: O(m) where m is queue length
 */

class QueueNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

export class FifoQueue {
  constructor() {
    this.head = null; // FRONT pointer
    this.tail = null; // REAR pointer
    this.length = 0;
    this.historyLogs = [];
  }

  /**
   * Enqueue: Adds an item to the rear of the queue in O(1)
   */
  enqueue(data) {
    const newNode = new QueueNode({
      ...data,
      id: data.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: data.timestamp || new Date().toISOString(),
      read: false
    });

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;

    const log = `[ENQUEUE] Added "${newNode.data.title || newNode.data.message}" at REAR (Queue length: ${this.length}).`;
    this.historyLogs.unshift(log);
    return newNode.data;
  }

  /**
   * Dequeue: Removes and returns the item from the front in O(1)
   */
  dequeue() {
    if (!this.head) return null;

    const removedNode = this.head;
    this.head = this.head.next;
    if (!this.head) {
      this.tail = null;
    }
    this.length--;

    const log = `[DEQUEUE] Processed & removed "${removedNode.data.title || removedNode.data.message}" from FRONT (Remaining: ${this.length}).`;
    this.historyLogs.unshift(log);
    return removedNode.data;
  }

  /**
   * Peek: Returns item at front without removing
   */
  peek() {
    return this.head ? this.head.data : null;
  }

  /**
   * Peek Rear: Returns item at rear without removing
   */
  peekRear() {
    return this.tail ? this.tail.data : null;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  /**
   * Converts the queue to an array with pointer metadata for visual representation
   */
  toArray() {
    const items = [];
    let current = this.head;
    let idx = 0;

    while (current) {
      items.push({
        ...current.data,
        queueIndex: idx,
        isFront: idx === 0,
        isRear: idx === this.length - 1
      });
      current = current.next;
      idx++;
    }
    return items;
  }

  serialize() {
    return this.toArray();
  }

  static deserialize(arr) {
    const queue = new FifoQueue();
    if (Array.isArray(arr)) {
      for (const item of arr) {
        queue.enqueue(item);
      }
    }
    return queue;
  }
}

/**
 * DoublyLinkedList - For bidirectional chat message history navigation.
 * Each node maintains:
 * - data: message content, sender, timestamp
 * - prev: pointer to previous node in conversation history
 * - next: pointer to next node in conversation history
 * 
 * Complexities:
 * - Insertion at tail: O(1)
 * - Traversal prev/next: O(1) per step
 * - Space: O(k)
 */
export class DoublyLinkedListNode {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(data) {
    const newNode = new DoublyLinkedListNode({
      ...data,
      id: data.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.size++;
    return newNode;
  }

  toArray() {
    const list = [];
    let curr = this.head;
    while (curr) {
      list.push({
        nodeId: curr.data.id,
        data: curr.data,
        hasPrev: curr.prev !== null,
        hasNext: curr.next !== null,
        prevId: curr.prev ? curr.prev.data.id : null,
        nextId: curr.next ? curr.next.data.id : null
      });
      curr = curr.next;
    }
    return list;
  }

  static fromArray(items) {
    const dll = new DoublyLinkedList();
    for (const item of items) {
      dll.append(item);
    }
    return dll;
  }
}
