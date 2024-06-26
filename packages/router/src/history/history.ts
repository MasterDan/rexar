import { Observable, distinctUntilChanged, map } from 'rxjs';
import { RouteLocation } from '../route/route-location';
import { HistoryBase } from './base.history';
import { Path } from '../route/path';

export class History extends HistoryBase {
  routeLocation$: Observable<RouteLocation> = this.location$.pipe(
    map((loc) => {
      const path = this.basePath
        ? Path.fromString(loc.pathname).filter(this.basePath)
        : Path.fromString(loc.pathname);

      return new RouteLocation({
        path: path.value,
      });
    }),
    distinctUntilChanged((a, b) => a.path?.value === b.path?.value),
  );
}

