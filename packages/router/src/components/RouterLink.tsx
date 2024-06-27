import { Source, defineComponent, toObservable } from '@rexar/core';
import { Observable, combineLatestWith, filter, map } from 'rxjs';
import { router$ } from '../router';
import { RouteLocation, RouteLocationSeed } from '../route/route-location';
import { Router } from '../router/router';

export const RouterLink = defineComponent<{
  to: Source<string | RouteLocationSeed>;
  content: (arg: { href$: Observable<string> }) => JSX.Element;
}>(({ to, content: Content }) => {
  const location$ = toObservable(to).pipe(
    map((r) =>
      typeof r === 'string'
        ? new RouteLocation({ path: r })
        : new RouteLocation(r),
    ),
  );
  const href$ = router$.pipe(
    filter((r): r is Router => r != null),
    combineLatestWith(location$),
    map(([router, loc]) => router.matchLocation(loc)?.value),
    filter((r): r is string => r != null),
  );
  return <Content href$={href$}></Content>;
});

