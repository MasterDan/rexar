import { defineComponent, useDynamic } from '@rexar/core';
import { BehaviorSubject, filter } from 'rxjs';
import { Route, RouteLocation, RouteView } from './route';

export type RouterArgs = {
  baseurl?: string;
  routes: Route[];
  useHash: boolean;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

  currentRoute$ = new BehaviorSubject<RouteView | null>(null);

  constructor(args: RouterArgs) {
    this.baseurl = args.baseurl;
    args.routes.forEach((route) => {
      if (route.redirect == null && route.render == null) {
        throw new Error(
          `Route with path="${route.path}" must have either render or redirect option`,
        );
      }
      if (
        this.routes.some(
          (r) =>
            (route.name != null && r.name === route.name) ||
            route.path === r.path,
        )
      ) {
        throw new Error(
          `Path "${route.path}"${
            route.name == null ? '' : ` or name "${route}"`
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

      if (loc.name != null) {
        return checkRedirect(this.routes.find((r) => r.name === loc.name));
      }
      if (loc.path != null) {
        return checkRedirect(this.routes.find((r) => r.path === loc.path));
      }
      throw new Error(
        'Cannot set location: Either path or name must be specified',
      );
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

