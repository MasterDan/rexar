import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  startWith,
} from 'rxjs';
import { RouteLocation } from '../route/route-location';
import { Path } from '../route/path';

export abstract class HistoryBase {
  private path$;

  protected basePath?: Path;

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.basePath = Path.fromString(baseUrl);
    }
    this.path$ = new BehaviorSubject<string | undefined>(baseUrl);
    this.path$
      .pipe(
        filter((p): p is string => p != null),
        distinctUntilChanged(),
      )
      .subscribe((path) => {
        window.history.pushState({}, '', path);
        dispatchEvent(new PopStateEvent('popstate'));
      });
  }

  abstract routeLocation$: Observable<RouteLocation>;

  location$ = fromEvent(window, 'popstate').pipe(
    map(() => document.location),
    startWith(document.location),
  );

  next(path: string) {
    if (this.basePath == null) {
      this.path$.next(path);
    } else {
      const combinedPath = this.basePath.combineWith(
        Path.fromString(path),
      ).value;
      this.path$.next(combinedPath);
    }
  }
}

