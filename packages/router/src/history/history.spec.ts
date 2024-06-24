import { beforeEach, describe, expect, test, vi } from 'vitest';

import { History } from './history';
import { RouteLocation } from '../route/route-location';

/**
 * @vitest-environment jsdom
 */
describe('non_hash history', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });
  test('check_path', () => {
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
  test('check_route_location', () => {
    const history = new History();
    let routeLocation: RouteLocation | undefined;
    const subscription = vi.fn((rl: RouteLocation) => {
      routeLocation = rl;
    });
    history.routeLocation$.subscribe(subscription);
    expect(routeLocation?.path?.value).toBe('/');
    history.next('/foo');
    expect(subscription).toBeCalledTimes(2);
    expect(routeLocation?.path?.value).toBe('/foo');
    history.next('/foo/bar');
    expect(subscription).toBeCalledTimes(3);
    expect(routeLocation?.path?.value).toBe('/foo/bar');
  });
  test('check_path_with_base_url', () => {
    const history = new History('base');
    let path: string | undefined;
    const subscription = vi.fn((current: Location) => {
      path = current.pathname;
      expect(current.protocol).toBe('http:');
      expect(current.host).toBe('localhost:3000');
    });
    history.location$.subscribe(subscription);
    expect(subscription).toBeCalled();
    history.next('/foo');
    expect(path).toBe('/base/foo');
    expect(subscription).toBeCalledTimes(2);
    history.next('/foo/bar');
    expect(path).toBe('/base/foo/bar');
    expect(subscription).toBeCalledTimes(3);
  });
  test('routeLocation_in_history_with_base_url', () => {
    const history = new History('base');
    let routeLocation: RouteLocation | undefined;
    const subscription = vi.fn((rl: RouteLocation) => {
      routeLocation = rl;
    });
    history.routeLocation$.subscribe(subscription);
    expect(routeLocation?.path?.value).toBe('/');
    history.next('/foo');
    expect(subscription).toBeCalledTimes(2);
    expect(routeLocation?.path?.value).toBe('/foo');
    history.next('/foo/bar');
    expect(subscription).toBeCalledTimes(3);
    expect(routeLocation?.path?.value).toBe('/foo/bar');
  });
});

