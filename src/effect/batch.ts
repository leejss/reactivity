import type { Effect } from "./types";

let batchDepth = 0;
const batchQueue = new Set<Effect>();

/**
 * Batches multiple updates together to prevent unnecessary re-renders
 */
export function batch<T>(fn: () => T): T {
  batchDepth++;
  try {
    return fn();
  } finally {
    batchDepth--;
    if (batchDepth === 0) {
      const queue = Array.from(batchQueue);
      batchQueue.clear();
      queue.forEach((effect) => effect.execute());
    }
  }
}

/**
 * Schedules an effect to run in the next microtask
 */
export function queueMicrotask(fn: () => void) {
  if (batchDepth > 0) {
    batchQueue.add({ execute: fn, dependencies: new Set() });
  } else {
    Promise.resolve().then(fn);
  }
}
