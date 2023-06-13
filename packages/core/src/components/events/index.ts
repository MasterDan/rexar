import { Subject } from 'rxjs';
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
