import { TrackableRef } from './trackable.ref';

export class Ref<T> extends TrackableRef<T> {
  set val(v: T) {
    super.next(v);
  }

  get val(): T {
    return super.val;
  }

  patch(fn: (v: T) => T | void) {
    const mayBeNewVal = fn(this.val);
    super.next(mayBeNewVal ?? this.val);
  }
}
