import { Observable, isObservable, of } from 'rxjs';
import { computed } from '@reactivity/computed';
import type { MaybeObservable } from '@reactivity/@types';

export type Source<T> = MaybeObservable<T> | (() => T);

export function toObservable<T>(arg: Source<T>): Observable<T> {
  if (isObservable(arg)) {
    return arg;
  }
  if (typeof arg === 'function') {
    return computed(arg as () => T);
  }
  return of(arg);
}
