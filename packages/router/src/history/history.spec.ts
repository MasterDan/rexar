import { describe, expect, test, vi } from 'vitest';

import { History } from './history';
import { RouteLocation } from '../route/route-location';

/**
 * @vitest-environment jsdom
 */
describe('non hash history', () => {
  test('check path', () => {
    const history = new History();
    let path: string | undefined;
    const subscription = vi.fn((current: Location) => {
      path = current.pathname;
      expect(current.protocol).toBe('http:');
      expect(current.host).toBe('localhost:3000');
    });
    history.location$.subscribe(subscription);
    expect(subscription).toBeCalled();
    history.next('/foo');
    expect(path).toBe('/foo');
    expect(subscription).toBeCalledTimes(2);
    history.next('/foo/bar');
    expect(path).toBe('/foo/bar');
    expect(subscription).toBeCalledTimes(3);
  });
  test('check route location', () => {
    const history = new History();
    let routeLocation: RouteLocation | undefined;
    const subscription = vi.fn((rl: RouteLocation) => {
      routeLocation = rl;
    });
    history.routeLocation$.subscribe(subscription);
    history.next('/foo');
    expect(subscription).toBeCalledTimes(2);
    expect(routeLocation?.path?.value).toBe('/foo');
    history.next('/foo/bar');
    expect(subscription).toBeCalledTimes(3);
    expect(routeLocation?.path?.value).toBe('/foo/bar');
  });
});

