import { TrackableRef } from './trackable.ref';

export class Ref<T> extends TrackableRef<T> {
  set val(v: T) {
    super.next(v);
  }

  get val(): T {
    return super.value;
  }

  patch(fn: (val: T) => T) {
    super.next(fn(this.value));
  }
}
