import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { isObservable, Subject } from 'rxjs';
import { EventEmitter } from './event';

export function createEvent<T = void>() {
  const listener$ = new Subject<T>();
  const emitter = new EventEmitter<T>((arg) => {
    listener$.next(arg);
  });
  return {
    listener$,
    emitter,
  };
}

export function triggerEvent<T = unknown>(
  event:
    | EventEmitter<T>
    | ReadonlyRef<EventEmitter<T>>
    | ReadonlyRef<undefined>
    | undefined
    | null,
  value: T,
): void {
  if (event == null) {
    return;
  }
  if (isObservable(event)) {
    event.value?.emit(value);
  } else {
    event.emit(value);
  }
}
