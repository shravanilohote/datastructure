/**
 * UndoRedoStack - Real LIFO (Last-In First-Out) Stack implementation for Pin Studio.
 * 
 * Provides:
 * - Pure Stack class with push, pop, peek, size, toArray
 * - UndoRedoManager that coordinates Undo Stack and Redo Stack
 * - Guarantees that any new action after Undo invalidates/clears Redo stack
 * 
 * Time Complexities:
 * - Push: O(1)
 * - Pop: O(1)
 * - Peek: O(1)
 * - Clear: O(1)
 * - Space: O(s) where s is number of retained edit snapshots
 */

export class Stack {
  constructor(name = 'Stack') {
    this.name = name;
    this.items = [];
  }

  push(element) {
    this.items.push(element);
  }

  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  /**
   * Returns array ordered from TOP (index 0) to BOTTOM for visual stack rendering
   */
  getStackView() {
    return [...this.items].reverse().map((item, idx) => ({
      ...item,
      stackIndex: this.items.length - 1 - idx,
      isTop: idx === 0
    }));
  }

  toArray() {
    return [...this.items];
  }
}

export class UndoRedoManager {
  constructor(initialState) {
    this.undoStack = new Stack('Undo Stack');
    this.redoStack = new Stack('Redo Stack');
    this.historyLogs = [];

    // Push initial baseline state
    if (initialState) {
      this.undoStack.push({
        id: 'init_state',
        description: 'Canvas Initialized',
        timestamp: new Date().toLocaleTimeString(),
        state: JSON.parse(JSON.stringify(initialState))
      });
      this.historyLogs.push('[INIT] Initialized canvas base state.');
    }
  }

  /**
   * Records a new user edit.
   * Crucial invariant: Any new modification MUST wipe out the redo stack.
   */
  recordAction(actionDescription, newState) {
    const entry = {
      id: `edit_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      description: actionDescription,
      timestamp: new Date().toLocaleTimeString(),
      state: JSON.parse(JSON.stringify(newState))
    };

    this.undoStack.push(entry);

    // Invalidate redo stack upon new branch of history
    const hadRedo = !this.redoStack.isEmpty();
    if (hadRedo) {
      const clearedCount = this.redoStack.size();
      this.redoStack.clear();
      this.historyLogs.unshift(`[NEW EDIT: PUSH] Pushed "${actionDescription}". Cleared ${clearedCount} Redo stack state(s) (branch diverged).`);
    } else {
      this.historyLogs.unshift(`[NEW EDIT: PUSH] Pushed "${actionDescription}" onto Undo Stack (Stack depth: ${this.undoStack.size()}).`);
    }

    return entry;
  }

  canUndo() {
    // We can undo if we have more than the base state
    return this.undoStack.size() > 1;
  }

  canRedo() {
    return !this.redoStack.isEmpty();
  }

  /**
   * Undo: Pop current state from Undo Stack, push to Redo Stack, return previous state
   */
  undo() {
    if (!this.canUndo()) return null;

    const currentState = this.undoStack.pop();
    this.redoStack.push(currentState);

    const targetState = this.undoStack.peek();
    this.historyLogs.unshift(
      `[UNDO: POP/PUSH] Popped "${currentState.description}" from Undo Stack -> Pushed to Redo Stack. Restored "${targetState.description}".`
    );

    return targetState ? targetState.state : null;
  }

  /**
   * Redo: Pop state from Redo Stack, push to Undo Stack, return restored state
   */
  redo() {
    if (!this.canRedo()) return null;

    const restoredState = this.redoStack.pop();
    this.undoStack.push(restoredState);

    this.historyLogs.unshift(
      `[REDO: POP/PUSH] Popped "${restoredState.description}" from Redo Stack -> Pushed to Undo Stack. Re-applied edit.`
    );

    return restoredState.state;
  }

  getCurrentState() {
    const top = this.undoStack.peek();
    return top ? top.state : null;
  }

  getUndoStackView() {
    return this.undoStack.getStackView();
  }

  getRedoStackView() {
    return this.redoStack.getStackView();
  }

  getLogs() {
    return this.historyLogs;
  }
}
