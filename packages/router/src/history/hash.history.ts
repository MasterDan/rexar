import { Observable, distinctUntilChanged, map } from 'rxjs';
import { RouteLocation } from '../route/route-location';
import { HistoryBase } from './base.history';
import { Path } from '../route/path';

export class HistoryHash extends HistoryBase {
  constructor(baseUrl?: string) {
    const hashPath = Path.fromString('#');
    super(
      baseUrl
        ? Path.fromString(baseUrl).combineWith(hashPath).value
        : hashPath.value,
    );
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

