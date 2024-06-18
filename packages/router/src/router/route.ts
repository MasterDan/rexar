import type {} from '@rexar/core';

export type Route = {
  path: string;
  name?: string;
  render?: () => JSX.Element;
  redirect?: RouteLocation;
  children?: Route[];
};

export type RouteLocation = {
  path?: string;
  name?: string;
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
};

export type RouteView = {
  render: () => JSX.Element;
  params: Record<string, unknown>;
  query: Record<string, unknown>;
};

