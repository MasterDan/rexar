import { onTrack } from '@reactivity/computed';
import { detectChanges } from './detect-changes';
import { TrackableBehaviorSubject } from './trackable-bs';

export class Ref<T> extends TrackableBehaviorSubject<T> {
  get value(): T {
    const val = super.value;
    if (!this.isTracked()) {
      onTrack(this);
    }

    if (typeof val === 'object' && val != null) {
      return detectChanges(val, () => {
        this.next(super.value);
      });
    }
    return val;
  }

  set value(val: T) {
    this.next(val);
  }
}

export function ref<T>(): Ref<T | undefined>;
export function ref<T>(value: T): Ref<T>;
export function ref<T>(value?: T): Ref<T | undefined> {
  return new Ref(value);
}
