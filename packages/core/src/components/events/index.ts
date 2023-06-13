import { ReadonlyRef } from '@core/reactivity/ref/readonly.ref';
import { isObservable, Subject } from 'rxjs';
import { EventEmitter, RexarEvent } from './event';

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

export function triggerEvent<T = void>(
  event: RexarEvent<T> | ReadonlyRef<RexarEvent<T>>,
  value: T,
) {
  if (event == null) {
    return;
  }
  if (isObservable(event)) {
    event.value?.emit(value);
  } else {
    event.emit(value);
  }
}
