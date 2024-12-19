export type Accessor<T> = () => T;
export type Setter<T> = (v: T | ((prev: T) => T)) => void;
export type Signal<T> = [get: Accessor<T>, set: Setter<T>];

export interface Effect {
  execute: () => void;
  cleanup?: () => void;
  dependencies: Set<Signal<any>>;
}

export type EffectFunction<T> = (v: T) => void | (() => void);
