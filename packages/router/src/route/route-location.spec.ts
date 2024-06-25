import { describe, expect, test } from 'vitest';
import { RouteLocation } from './route-location';

describe('route_location', () => {
  test('with_empty_path', () => {
    const loc = new RouteLocation({
      path: '',
    });
    expect(loc.path?.size).toBe(0);
    expect(loc.path?.value).toBe('/');
  });
  test('location_with_query_params', () => {
    const location = new RouteLocation({
      path: '/foo',
      query: {
        a: 'b',
        c: 'd',
      },
    });
    expect(location.path?.value).toBe('/foo?a=b&c=d');
  });
  test('location_with_query_params_in_path', () => {
    const location = new RouteLocation({
      path: '/foo?a=b&c=d',
    });
    expect(location.path?.value).toBe('/foo?a=b&c=d');
    expect(location.path?.queryParams).toEqual({ a: 'b', c: 'd' });
  });
  test('location_with_params', () => {
    const location = new RouteLocation({
      path: '/foo/:bar/:baz',
      params: {
        bar: 'barVal',
        baz: 'bazVal',
      },
    });
    expect(location.path?.value).toBe('/foo/barVal/bazVal');
  });
});

