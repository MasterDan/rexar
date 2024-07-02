import { describe, expect, test } from 'vitest';
import { RouteNext } from '.';

describe('route-next', () => {
  test('route-next', () => {
    const route = RouteNext.fromString('/foo/:id');
    expect(route.pattern).toBe('/foo/:id');
    route.setParam((p) => p.name === 'id', '123');
    expect(route.value).toBe('/foo/123');
  });
});

