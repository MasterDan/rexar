import { isObservable, Observable } from 'rxjs';
import type { MaybeObservable } from '@/@types/MaybeObservable';
import { ComputedRef } from './computed.ref';
import { TrackableWritableRef } from './trackable.writable.ref';

export function ref$<T>(init: Observable<T>, fallack: T): ComputedRef<T>;
export function ref$<T>(init: Observable<T>): ComputedRef<T | undefined>;
export function ref$<T>(): TrackableWritableRef<T | undefined>;
export function ref$<T>(init: T): TrackableWritableRef<T>;
export function ref$<T>(init?: MaybeObservable<T>, fallack?: T) {
  if (isObservable(init)) {
    return fallack
      ? new ComputedRef<T>(init, fallack)
      : new ComputedRef<T | undefined>(init, fallack);
  }
  return init
    ? new TrackableWritableRef<T>(init)
    : new TrackableWritableRef<T | undefined>(init);
}
