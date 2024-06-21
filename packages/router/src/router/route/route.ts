import type {} from '@rexar/core';
import { Path } from './path';
import { RouteLocation, RouteLocationArg } from './route-location';

export type RouteArg = {
  path: string;
  name?: string;
  render?: () => JSX.Element;
  redirect?: RouteLocationArg;
  children?: RouteArg[];
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

  constructor(args: RouteArg, public parent?: Route) {
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
}

export type RouteView = {
  render: () => JSX.Element;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
};

