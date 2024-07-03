import { describe, expect, test } from 'vitest';
import { RouteNext } from '.';

describe('route-next', () => {
  test('route-next', () => {
    const route = RouteNext.fromString('/foo/:id');
    expect(route.pattern).toBe('/foo/:id');
    route.setParam((p) => p.name === 'id', '123');
    expect(route.value).toBe('/foo/123');
    route.setParam('id', '456');
    expect(route.value).toBe('/foo/456');
  });
  test('filled-prop', () => {
    const route = RouteNext.fromString('/foo/:id');
    expect(route.filled).toBe(false);
    const route2 = RouteNext.fromString('/foo/bar');
    expect(route2.filled).toBe(true);
    const route3 = RouteNext.fromString('/foo/?bar');
    expect(route3.filled).toBe(true);
    const route4 = RouteNext.fromString('/foo/bar/*');
    expect(route4.filled).toBe(true);
  });
});

