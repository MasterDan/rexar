import { createProvider, defineComponent, useDynamic } from '@rexar/core';
import { filter, map, switchMap } from 'rxjs';
import { routeProvider } from '../router/use-route';
import { router$ } from '../router';
import { RouteView, Router } from '../router/router';

const depthProvider = createProvider<number>(0);

export const RouterView = defineComponent(() => {
  const [View, setView] = useDynamic();
  const depth = depthProvider.inject();
  depthProvider.provide(depth + 1);
  const currentRoutes$ = router$.pipe(
    filter((r): r is Router => r != null),
    switchMap((r) => r.currentRoutes$),
  );
  routeProvider.provide(
    currentRoutes$.pipe(
      map((r) => r[depth]),
      filter((r): r is RouteView => r != null),
      map(({ params, query }) => ({ params, query })),
    ),
  );
  currentRoutes$
    .pipe(
      map((r) => r[depth]),
      filter((r): r is RouteView => r != null),
    )
    .subscribe((route) => {
      setView(route.render);
    });
  return <View />;
});

