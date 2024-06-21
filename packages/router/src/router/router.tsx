import { createProvider, defineComponent, useDynamic } from '@rexar/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Route, RouteArg, RouteView } from './route/route';

export type RouterArgs = {
  baseurl?: string;
  routes: RouteArg[];
  useHash: boolean;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

  currentRoutes$ = new BehaviorSubject<RouteView[]>([]);

  constructor(args: RouterArgs) {
    this.baseurl = args.baseurl;
    args.routes.forEach((routeArg) => {
      const route = new Route(routeArg);

      if (
        this.routes.some(
          (r) =>
            (route.name != null && r.name === route.name) ||
            r.path.includes(route.path),
        )
      ) {
        throw new Error(
          `Path "${routeArg.path}"${
            routeArg.name == null ? '' : ` or name "${routeArg}"`
          } already exists`,
        );
      }
      this.routes.push(route);
    });
  }

  createComponents() {
    const depthProvider = createProvider<number>(0);

    const RouterView = defineComponent(() => {
      const [View, setView] = useDynamic();
      const depth = depthProvider.inject();
      depthProvider.provide(depth + 1);
      this.currentRoutes$
        .pipe(
          map((r) => r[depth]),
          filter((r): r is RouteView => r != null),
        )
        .subscribe((route) => {
          setView(route.render);
        });
      return <View />;
    });

    return [RouterView];
  }
}

