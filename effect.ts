import type { Signal, Subscriber } from "./signal";

type SyncFn = () => void;

type EffectFunction = (() => void) & { dependencies: Set<Signal<any>> };

export let currentEffect: EffectFunction | null = null;

export function createEffect(fn: SyncFn) {
  const effectFn: EffectFunction = () => {
    // Clean up previous dependencies

    // TODO: How to clean up previous dependencies correctly?
    // effectFn.dependencies.forEach((signal) => {
    //   signal.subscribers.delete(effectFn);
    // });
    // effectFn.dependencies.clear();

    // Set the current effect
    currentEffect = effectFn;
    // Execute the function
    fn();
    // Clear the current effect
    currentEffect = null;
  };

  effectFn.dependencies = new Set<Signal<any>>();
  effectFn();
}
