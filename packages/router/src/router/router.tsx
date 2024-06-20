import { defineComponent, useDynamic } from '@rexar/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Route, RouteArg, RouteView } from './route/route';
import { RouteLocation } from './route/route-location';

export type RouterArgs = {
  baseurl?: string;
  routes: RouteArg[];
  useHash: boolean;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

  currentRoute$ = new BehaviorSubject<RouteView | null>(null);

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

  findRouteByLocation(location: RouteLocation): Route | undefined {
    const find = (loc: RouteLocation): Route | undefined => {
      const checkRedirect = (r?: Route) => {
        if (r == null) {
          return undefined;
        }
        if (r.redirect != null) {
          return find(r.redirect);
        }
        return r;
      };

      return checkRedirect(this.routes.find((r) => loc.matchRoute(r)));
    };
    return find(location);
  }

  setLocation(location: RouteLocation) {
    const route = this.findRouteByLocation(location);
    if (route == null) {
      throw new Error(`Route with path="${location.path}" not found`);
    }
    if (route.render) {
      this.currentRoute$.next({
        render: route.render,
        params: location.params ?? {},
        query: location.query ?? {},
      });
    }
  }

  createComponents() {
    const RouterView = defineComponent(() => {
      const [View, setView] = useDynamic();
      this.currentRoute$
        .pipe(filter((r): r is RouteView => r != null))
        .subscribe((route) => {
          setView(route.render);
        });
      return <View />;
    });

    return [RouterView];
  }
}

