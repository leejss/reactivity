import { currentEffect } from "./effect";

export type Subscriber<T> = (value: T) => void;

export class Signal<T> {
  private _subscribers: Set<Subscriber<T>> = new Set();

  constructor(private _value: T) {}

  private _notify() {
    this._subscribers.forEach((subscriber) => subscriber(this._value));
  }

  private _trackEffect() {
    if (currentEffect) {
      this._subscribers.add(currentEffect);
      currentEffect.dependencies.add(this);
    }
  }

  set value(newValue: T) {
    if (newValue !== this._value) {
      this._value = newValue;
      this._notify();
    }
  }

  get value(): T {
    this._trackEffect();
    return this._value;
  }

  get subscribers() {
    return this._subscribers;
  }
}
