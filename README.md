# PinLogic &ndash; Exploring Pinterest Through Data Structures

> **Activity 2: Data Structures Academic Demonstration Project**  
> **Team:** ALGO_MINDS  
> **Institution:** Zeal College of Engineering and Research, Narhe, Pune  
> **Repository:** [https://github.com/shravanilohote/datastructure](https://github.com/shravanilohote/datastructure)

---

## 📌 Overview

**PinLogic** is a full-stack, responsive visual discovery platform inspired by Pinterest. It demonstrates how four fundamental data structures power real-time discovery, feed ranking, event dispatching, and stateful pin editing at scale.

```
                      Pinterest-like User Session
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
   Follow System               Home Feed               Notifications           Pin Editor Studio
         |                         |                         |                         |
         v                         v                         v                         v
   Directed Graph              Max-Heap                 FIFO Queue                 LIFO Stack
(Adj Lists + Hash Sets)     (Binary Tree Array)     (Head/Tail Pointers)        (Dual Undo/Redo)
```

---

## 🛠️ The 4 Core Data Structures

### 1. Module 1: Follow & Board Graph &ndash; Directed Graph ($G = (V, E)$)
* **Underlying Implementation:** Adjacency List (`Map<UserId, Set<UserId>>`) paired with Hash Sets and reverse indexing.
* **Why Suitable:** Social relationships in visual discovery platforms are inherently asymmetric ($A \to B$ does not imply $B \to A$).
* **Key Operations:**
  * Follow Insertion: $O(1)$ average
  * Unfollow Deletion: $O(1)$ average
  * Follow Lookup: $O(1)$ average via Hash Set
  * Mutual Followings ($\text{Adj}[A] \cap \text{Adj}[B]$): $O(\min(d_A, d_B))$
  * Social Distance Exploration (BFS): $O(V + E)$
  * Space Complexity: $O(V + E)$

### 2. Module 2: Personalized Home Feed &ndash; Binary Max-Heap
* **Underlying Implementation:** 0-indexed contiguous binary heap array where parent is $\lfloor(i-1)/2\rfloor$, left child is $2i+1$, right child is $2i+2$.
* **Ranking Score Formula:**
  $$\text{Score} = (\text{Saves} \times 3.5) + (\text{Likes} \times 2.0) + (\text{Comments} \times 1.8) + \text{RecencyBonus}$$
* **Why Suitable:** Users only request the top $K$ items. Sorting all $n$ candidates costs $O(n \log n)$, whereas a Max-Heap builds in $O(n)$ and extracts the top $K$ in $O(K \log n)$ time.
* **Key Operations:**
  * Peek Max (Inspect Root): $O(1)$
  * Insert (Sift-Up): $O(\log n)$
  * Extract Max (Sift-Down): $O(\log n)$
  * Build Heap: $O(n)$
  * Top-K Extraction: $O(K \log n)$
  * Space Complexity: $O(n)$

### 3. Module 3: Notifications & Messages &ndash; Strict FIFO Queue
* **Underlying Implementation:** Singly linked queue with explicit `head` (FRONT) and `tail` (REAR) pointer tracking + Doubly Linked List for chat message history.
* **Why Suitable:** Notification pipelines ingest asynchronous events and must process them in chronological arrival order without priority inversion.
* **Key Operations:**
  * Enqueue at Rear: $O(1)$
  * Dequeue from Front: $O(1)$
  * Unread Counter Read/Reset: $O(1)$
  * Doubly Linked List History Navigation: $O(1)$ per step
  * Space Complexity: $O(m)$

### 4. Module 4: Pin Studio Undo/Redo &ndash; LIFO Stack
* **Underlying Implementation:** Dual Array Stack (`undoStack` and `redoStack`).
* **Why Suitable:** Canvas modifications follow strict Last-In First-Out reversal.
* **The Branch Invariant:** Any new edit after an Undo operation immediately purges the Redo stack in $O(1)$ time to maintain causal consistency.
* **Key Operations:**
  * Push State: $O(1)$
  * Pop State (Undo): $O(1)$
  * Redo State: $O(1)$
  * Clear Redo: $O(1)$
  * Space Complexity: $O(s)$

---

## 💻 Tech Stack

* **Frontend:** React 19, JavaScript (ES6+)
* **Tooling:** Vite, PostCSS, Autoprefixer
* **Styling:** Tailwind CSS, Custom Masonry Layout
* **Icons & Visuals:** Lucide React, Canvas API, Canvas Confetti
* **Persistence:** LocalStorage

---

## 👥 Project Team: ALGO_MINDS

**Zeal College of Engineering and Research, Narhe, Pune**

* **Project Manager:** Shravani Lohote
* **System Architects:** Khushi Chopde, Monika Limbekar
* **Algorithm Analysts:** Saloni Limbore, Ragini Sable
* **Data Modelers:** Nayana Kalaskar, Kiran Ban

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm (v9+)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/shravanilohote/datastructure.git

# Enter project directory
cd datastructure

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 📜 References

1. *Pixie: A System for Recommending 3+ Billion Items to 200+ Million Users in Real-Time* (Pinterest Engineering, ACM SIGKDD).
2. *Graph Convolutional Neural Networks for Web-Scale Recommender Systems (PinSage)* (ACM SIGKDD 2018).
3. *Introduction to Algorithms, 4th Edition* (Cormen, Leiserson, Rivest, Stein &ndash; MIT Press).
4. *Pinterest Engineering: Building a Real-time Notification Dispatch Pipeline*.
