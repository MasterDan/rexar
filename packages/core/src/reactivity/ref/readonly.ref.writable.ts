import { isObservable, Observable } from 'rxjs';
import { ReadonlyRef } from './readonly.ref';

export interface IWritableReadonlyRefArg<T> {
  source$: Observable<T>;
  set: (value: T) => void;
  fallback: T;
}

export function isWritableReadonlyRefArg<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arg: any,
): arg is IWritableReadonlyRefArg<T> {
  return (
    typeof arg === 'object' &&
    isObservable(arg.source$) &&
    typeof arg.set === 'function'
  );
}

export class WritableReadonlyRef<T> extends ReadonlyRef<T> {
  private setter: (value: T) => void;

  constructor({ source$, set, fallback }: IWritableReadonlyRefArg<T>) {
    super(source$, fallback);
    this.setter = set;
  }

  set val(v: T) {
    this.setter(v);
  }
}
