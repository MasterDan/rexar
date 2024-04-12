import { onTrack } from '@reactivity/computed';
import { readonly } from './detect-changes';
import { TrackableBehaviorSubject } from './trackable-bs';

export class ReadonlyRef<T> extends TrackableBehaviorSubject<T> {
  get value() {
    const val = super.value;
    if (!this.isTracked()) {
      onTrack(this);
    }
    if (val != null && typeof val === 'object') {
      return readonly(val);
    }
    return val;
  }

  get valueUntracked() {
    return super.value;
  }
}
