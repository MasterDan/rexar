import { isObservable, Observable } from 'rxjs';
import type { MaybeObservable } from '@/@types/MaybeObservable';
import { container } from 'tsyringe';
import { ReadonlyRef } from './readonly.ref';
import { TrackableWritableRef } from './trackable.writable.ref';
import { Ref } from './ref';
import type { ComputedBuilder } from '../computed/computed-builder';
import { computedBuiderToken } from '../computed/computed-builer.token';

export function ref$<T>(init: () => T): ReadonlyRef<T>;
export function ref$<T>(init: Observable<T>, fallack: T): ReadonlyRef<T>;
export function ref$<T>(init: Observable<T>): ReadonlyRef<T | undefined>;
export function ref$<T>(): TrackableWritableRef<T | undefined>;
export function ref$<T>(init: T): TrackableWritableRef<T>;
export function ref$<T>(init?: MaybeObservable<T> | (() => T), fallack?: T) {
  if (typeof init === 'function') {
    const builder = container.resolve<ComputedBuilder>(computedBuiderToken);
    return builder.build(init as () => T);
  }

  if (isObservable(init)) {
    return fallack
      ? new ReadonlyRef<T>(init, fallack)
      : new ReadonlyRef<T | undefined>(init, fallack);
  }
  return init
    ? new TrackableWritableRef<T>(init)
    : new TrackableWritableRef<T | undefined>(init);
}

export function readonly<T>(ref: Ref<T>) {
  return ref$(ref);
}
