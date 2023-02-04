import { TrackableRef } from './trackable.ref';

export class TrackableWritableRef<T> extends TrackableRef<T> {
  set val(v: T) {
    super.next(v);
  }

  get val(): T {
    return super.val;
  }

  patch(fn: (val: T) => T) {
    super.next(fn(this.val));
  }
}
