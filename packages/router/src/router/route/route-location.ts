import { Path } from './path';
import type { Route } from './route';

export type RouteLocationArg = {
  path?: string | Path;
  name?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export class RouteLocation {
  path?: Path;

  name?: string;

  params?: Record<string, unknown>;

  query?: Record<string, unknown>;

  constructor(args: RouteLocationArg) {
    if (args.path == null && args.name == null) {
      throw new Error(
        'RouteLocation must have either a "path" or "name" property',
      );
    }
    this.name = args.name;
    this.params = args.params;
    this.query = args.query;
    if (args.path) {
      this.path =
        args.path instanceof Path ? args.path : Path.fromString(args.path);
      if (this.params) {
        this.path = this.path.withParams(this.params);
      }
      if (this.query) {
        if (this.path.queryParams) {
          this.query = { ...this.path.queryParams, ...this.query };
        }
        this.path.queryParams = this.query;
      }
    }
  }

  matchRoute(route: Route, { deep }: { deep: boolean } = { deep: false }) {
    if (this.name != null) {
      return this.name === route.name;
    }
    if (this.path != null) {
      return route.includes(this.path, { deep });
    }
    throw new Error(
      'RouteLocation must have either a "path" or "name" property',
    );
  }
}

