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

export abstract class HistoryBase {
  private $path$ = new BehaviorSubject<string | undefined>(undefined);

  abstract routeLocation$: Observable<RouteLocation>;

  protected path$ = this.$path$.pipe(
    filter((p): p is string => p != null),
    distinctUntilChanged(),
  );

  location$ = fromEvent(window, 'popstate').pipe(
    map(() => document.location),
    startWith(document.location),
  );

  next(path: string) {
    this.$path$.next(path);
  }
}

