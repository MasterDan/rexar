import { createProvider, defineComponent, useDynamic } from '@rexar/core';
import { BehaviorSubject, filter, map } from 'rxjs';
import { AnyRecord } from '@rexar/tools';
import { Route, RouteSeed } from '../route';
import { RouteLocation } from '../route/route-location';
import { HistoryMode } from '../history';
import { HistoryBase } from '../history/base.history';
import { routeProvider } from './route-info';

export type RouterSeed = {
  baseurl?: string;
  routes: RouteSeed[];
  history: HistoryMode;
};

export type RouteView = {
  render: () => JSX.Element;
  params: AnyRecord<string>;
  query: AnyRecord<string>;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

  currentRoutes$ = new BehaviorSubject<RouteView[]>([]);

  history: HistoryBase;

  constructor(args: RouterSeed) {
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
    this.history.routeLocation$.subscribe((routeLocation) => {
      const { path } = routeLocation;
      if (path == null) {
        throw new Error('Path is not defined');
      }
      const route = this.findRoute(routeLocation);
      if (route == null) return;
      const routes = route.withParents;
      let skip = 0;
      const views = routes.map((r) => {
        const { render } = r;
        if (render == null) {
          throw new Error(`Cannot render route "${r.path.value}"`);
        }
        const subPath = path.slice(skip, r.path.size);
        skip += subPath.size;
        const params = r.path.pickParamsFrom(subPath);
        const view: RouteView = {
          params,
          query: subPath.queryParams ?? {},
          render,
        };
        return view;
      });
      this.currentRoutes$.next(views);
    });
  }

  findRoute(loc: RouteLocation): Route | undefined {
    const checkRedirect = (route?: Route) => {
      if (route == null) return route;
      if (route.render) return route;
      if (route.redirect) return this.findRoute(route.redirect);
      return undefined;
    };
    if (loc.name != null) {
      return checkRedirect(Route.findByName(this.routes, loc.name));
    }
    if (loc.path != null) {
      const len = this.currentRoutes$.value.length;
      return checkRedirect(
        Route.findByPath(this.routes, loc.path, len > 0 ? len : undefined),
      );
    }
    return undefined;
  }

  setLocation(loc: RouteLocation) {
    const route = this.findRoute(loc);

    if (route == null) return;
    let path = route.deepPath;
    if (loc.params) {
      path = path.withParams(loc.params);
    }
    if (loc.query) {
      path.queryParams = loc.query;
    }

    this.history.next(path.value);
  }

  createComponents() {
    const depthProvider = createProvider<number>(0);

    const RouterView = defineComponent(() => {
      const [View, setView] = useDynamic();
      const depth = depthProvider.inject();
      routeProvider.provide(
        this.currentRoutes$.pipe(
          map((r) => r[depth]),
          filter((r): r is RouteView => r != null),
          map(({ params, query }) => ({ params, query })),
        ),
      );
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

