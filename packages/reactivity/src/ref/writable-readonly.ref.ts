import { onTrack } from '@reactivity/computed';
import { detectChanges } from './detect-changes';
import { TrackableBehaviorSubject } from './trackable-bs';

export class WritableReadonlyRef<T> extends TrackableBehaviorSubject<T> {
  constructor(value: T, private setter: (value: T) => void) {
    super(value);
  }

  get value(): T {
    const val = super.value;
    if (!this.isTracked()) {
      onTrack(this);
    }
    if (val != null && typeof val === 'object') {
      return detectChanges(val, () => {
        this.setter(super.value);
      });
    }
    return val;
  }

  set value(arg) {
    this.setter(arg);
  }
}
