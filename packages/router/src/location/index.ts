import { fromEvent, map, pairwise, startWith } from 'rxjs';

export type LocationChangeEvent = {
  previous?: Location;
  current: Location;
};

export function onLocationChange() {
  const location$ = fromEvent(window, 'popstate').pipe(
    map(() => document.location),
    startWith(document.location),
    startWith(undefined),
    pairwise(),
    map(
      ([previous, current]): LocationChangeEvent => ({
        previous,
        current: current!,
      }),
    ),
  );
  return location$;
}

