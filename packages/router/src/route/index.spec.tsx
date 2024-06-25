import { describe, expect, test } from 'vitest';
import { Route } from '.';
import { Path } from './path';

describe('route', () => {
  test('find_by_path', () => {
    const base = new Route({
      path: '/',
      render: () => <></>,
    });
    const foo = new Route({
      path: '/foo',
      render: () => <></>,
    });
    const bar = new Route({
      path: '/bar',
      render: () => <></>,
    });
    const routes = [base, foo, bar];
    const emptyPath = Path.fromString('/');
    expect(Route.findByPath(routes, emptyPath)?.path.value).toBe('/');

    const emptyPath2 = Path.fromString('');
    expect(Route.findByPath(routes, emptyPath2)?.path.value).toBe('/');

    const pathFoo = Path.fromString('/foo');
    expect(Route.findByPath(routes, pathFoo)?.path.value).toBe('/foo');
  });
});

