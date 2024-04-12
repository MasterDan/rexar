import { trackingScopeToken } from '@reactivity/anti-cycle/tokens';
import { BehaviorSubject } from 'rxjs';

export class TrackableBehaviorSubject<T> extends BehaviorSubject<T> {
  private trackedBy = new Set<symbol>();

  track(key: symbol) {
    this.trackedBy.add(key);
  }

  isTracked() {
    const scope = trackingScopeToken.value.current;
    if (scope) {
      return this.trackedBy.has(scope.key);
    }
    return false;
  }
}
