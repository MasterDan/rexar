import type {} from '@rexar/core';
import { Path } from './path';
import { RouteLocation, RouteLocationSeed } from './route-location';

export type RouteSeed = {
  path: string;
  name?: string;
  render?: () => JSX.Element;
  redirect?: RouteLocationSeed;
  children?: RouteSeed[];
};

export class Route {
  path: Path;

  name: string | undefined;

  render: (() => JSX.Element) | undefined;

  redirect: RouteLocation | undefined;

  children: Route[] | undefined;

  get deepPath(): Path {
    if (this.parent == null) {
      return this.path;
    }
    return this.parent.deepPath.combineWith(this.path);
  }

  get withParents(): Route[] {
    if (this.parent == null) {
      return [this];
    }
    return [...this.parent.withParents, this];
  }

  get depth(): number {
    if (this.parent == null) return 0;
    return this.parent.depth + 1;
  }

  constructor(args: RouteSeed, public parent?: Route) {
    this.path = Path.fromString(args.path);
    this.name = args.name;
    this.render = args.render;
    this.redirect = args.redirect
      ? new RouteLocation(args.redirect)
      : undefined;
    this.children = args.children?.map((child) => new Route(child, this));
  }

  includes(other: Path, { deep }: { deep: boolean } = { deep: false }) {
    const path = deep ? this.deepPath : this.path;
    return path.includes(other);
  }

  static findByName(routes: Route[], name: string): Route | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const route of routes) {
      if (route.name === name) {
        return route;
      }
      if (route.children != null) {
        const foundRoute = Route.findByName(route.children, name);
        if (foundRoute != null) {
          return foundRoute;
        }
      }
    }
    return undefined;
  }

  static findByPath(
    routes: Route[],
    path: Path,
    nonDeepDepth?: number,
  ): Route | undefined {
    const findRoutesByPath = (currentRoutes: Route[]): Route | undefined => {
      // eslint-disable-next-line no-restricted-syntax
      for (const route of currentRoutes) {
        if (
          nonDeepDepth &&
          nonDeepDepth <= route.depth &&
          route.includes(path)
        ) {
          return route;
        }
        if (route.includes(path, { deep: true })) {
          return route;
        }
        if (route.children != null) {
          const mayBeChild = findRoutesByPath(route.children);
          if (mayBeChild != null) {
            return mayBeChild;
          }
        }
      }
      return undefined;
    };

    return findRoutesByPath(routes);
  }
}

