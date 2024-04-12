import { Observable, isObservable, of } from 'rxjs';
import { computed } from '@reactivity/computed';
import type { MaybeObservable } from '@reactivity/@types';

export type ValueOrObservableOrGetter<T> = MaybeObservable<T> | (() => T);

export function toObservable<T>(
  arg: ValueOrObservableOrGetter<T>,
): Observable<T> {
  if (isObservable(arg)) {
    return arg;
  }
  if (typeof arg === 'function') {
    return computed(arg as () => T);
  }
  return of(arg);
}
