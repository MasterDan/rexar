import { Observable, distinctUntilChanged, map } from 'rxjs';
import { RouteLocation } from '../router/route/route-location';
import { HistoryBase } from './base.history';

export class History extends HistoryBase {
  constructor() {
    super();
    this.path$.subscribe((path) => {
      window.history.pushState({}, '', path);
      dispatchEvent(new PopStateEvent('popstate'));
    });
  }

  routeLocation$: Observable<RouteLocation> = this.location$.pipe(
    map(
      (loc) =>
        new RouteLocation({
          path: loc.pathname,
        }),
    ),
    distinctUntilChanged((a, b) => a.path?.value === b.path?.value),
  );
}

