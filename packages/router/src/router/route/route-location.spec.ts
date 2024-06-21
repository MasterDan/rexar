import { describe, expect, test } from 'vitest';
import { RouteLocation } from './route-location';

describe('route location', () => {
  test('location with query params', () => {
    const location = new RouteLocation({
      path: '/foo',
      query: {
        a: 'b',
        c: 'd',
      },
    });
    expect(location.path?.value).toBe('/foo?a=b&c=d');
  });
  test('location with query params in path', () => {
    const location = new RouteLocation({
      path: '/foo?a=b&c=d',
    });
    expect(location.path?.value).toBe('/foo?a=b&c=d');
    expect(location.path?.queryParams).toEqual({ a: 'b', c: 'd' });
  });
  test('location with params', () => {
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

