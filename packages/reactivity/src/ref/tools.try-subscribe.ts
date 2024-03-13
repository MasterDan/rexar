import { Observable, isObservable, of } from 'rxjs';
import { computed } from '@reactivity/computed';
import type { MaybeObservable } from '@reactivity/@types';

export type Providable<T> = MaybeObservable<T> | (() => T);

export function trySubscribe<T>(
  arg: Providable<T>,
  subscription: (value: T) => void,
) {
  if (isObservable(arg)) {
    arg.subscribe(subscription);
  } else if (typeof arg === 'function') {
    computed(arg as () => T).subscribe(subscription);
  } else {
    subscription(arg);
  }
}

export function toObservable<T>(arg: Providable<T>): Observable<T> {
  if (isObservable(arg)) {
    return arg;
  }
  if (typeof arg === 'function') {
    return computed(arg as () => T);
  }
  return of(arg);
}
