import type { Signal, Accessor, Setter, Effect } from "./types";

let currentEffect: Effect | null = null;

/**
 * Creates a reactive signal with getter and setter
 */
export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<Effect>();

  const getter: Accessor<T> = () => {
    if (currentEffect) {
      subscribers.add(currentEffect);
      currentEffect.dependencies.add([getter, setter]);
    }
    return value;
  };

  const setter: Setter<T> = (nextValue) => {
    value =
      typeof nextValue === "function"
        ? (nextValue as (prev: T) => T)(value)
        : nextValue;

    // Notify subscribers
    queueMicrotask(() => {
      subscribers.forEach((effect) => {
        effect.execute();
      });
    });
  };

  return [getter, setter];
}
