import { Observable, distinctUntilChanged, map } from 'rxjs';
import { RouteLocation } from '../route/route-location';
import { HistoryBase } from './base.history';

export class HistoryHash extends HistoryBase {
  constructor() {
    super();
    this.path$.subscribe((path) => {
      window.history.pushState({}, '', `#${path}`);
      dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  routeLocation$: Observable<RouteLocation> = this.location$.pipe(
    map(
      (loc) =>
        new RouteLocation({
          path: loc.hash.slice(1),
        }),
    ),
    distinctUntilChanged((a, b) => a.path?.value === b.path?.value),
  );
}

