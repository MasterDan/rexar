import { Route } from './route';

export type RouterArgs = {
  baseurl?: string;
  routes: Route[];
  useHash: boolean;
};

export class Router {
  baseurl?: string;

  routes: Route[] = [];

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
}

