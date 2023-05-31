import { TrackableRef } from './trackable.ref';

export class Ref<T> extends TrackableRef<T> {
  set value(v: T) {
    super.next(v);
  }

  get value(): T {
    return super.value;
  }

  patch(fn: (v: T) => T | void) {
    const mayBeNewVal = fn(this.value);
    super.next(mayBeNewVal ?? this.value);
  }
}
