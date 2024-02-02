import { trackingScopeProvider } from '@reactivity/anti-cycle/anti-cycle';
import { BehaviorSubject } from 'rxjs';

export class TrackableBehaviorSubject<T> extends BehaviorSubject<T> {
  private trackedBy = new Set<symbol>();

  track(key: symbol) {
    this.trackedBy.add(key);
  }

  isTracked() {
    const scope = trackingScopeProvider.value.current;
    if (scope) {
      return this.trackedBy.has(scope.key);
    }
    return false;
  }
}
