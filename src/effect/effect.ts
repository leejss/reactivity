import { createSignal } from "./signal";
import type { Effect, EffectFunction } from "./types";

let currentEffect: Effect | null = null;

/**
 * Creates a reactive effect that automatically tracks dependencies
 */
export function createEffect<T>(fn: EffectFunction<T>): void {
  const effect: Effect = {
    execute: () => {
      // Cleanup previous execution if needed
      if (effect.cleanup) {
        effect.cleanup();
      }

      // Clear previous dependencies
      effect.dependencies.clear();

      // Set current effect for dependency tracking
      const prevEffect = currentEffect;
      currentEffect = effect;

      try {
        const cleanup = fn(undefined as T);
        if (typeof cleanup === "function") {
          effect.cleanup = cleanup;
        }
      } finally {
        currentEffect = prevEffect;
      }
    },
    dependencies: new Set(),
  };

  // Initial execution
  effect.execute();
}

/**
 * Creates a memo that caches its value and only updates when dependencies change
 */
export function createMemo<T>(fn: () => T): () => T {
  const [get, set] = createSignal<T>(undefined as T);

  createEffect(() => {
    set(fn());
  });

  return get;
}
