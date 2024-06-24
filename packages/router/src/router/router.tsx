import { createProvider, defineComponent, useDynamic } from '@rexar/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { Route, RouteArg } from '../route';
import { RouteLocation } from '../route/route-location';
import { HistoryMode } from '../history';
import { HistoryBase } from '../history/base.history';

export type RouterArgs = {
  baseurl?: string;
  routes: RouteArg[];
  history: HistoryMode;
};

export type RouteView = {
  routeIndex: number;
  render: () => JSX.Element;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

  currentRoutes$ = new BehaviorSubject<RouteView[]>([]);

  history: HistoryBase;

  constructor(args: RouterArgs) {
    this.history = args.history(args.baseurl);
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

  findRoute(loc: RouteLocation): Route | undefined {
    if (loc.name != null) {
      return Route.findByName(this.routes, loc.name);
    }
    if (loc.path != null) {
      const len = this.currentRoutes$.value.length;
      return Route.findByPath(this.routes, loc.path, len > 0 ? len : undefined);
    }
    return undefined;
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

