import { beforeEach, describe, expect, test, vi } from 'vitest';
import { RouteLocation } from '../route/route-location';
import { HistoryHash } from './hash.history';

/**
 * @vitest-environment jsdom
 */
describe('hash_history', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });
  test('check_hash', () => {
    const history = new HistoryHash();
    let hash: string | undefined;
    const subscription = vi.fn((current: Location) => {
      hash = current.hash;
      expect(current.protocol).toBe('http:');
      expect(current.host).toBe('localhost:3000');
    });
    history.location$.subscribe(subscription);
    expect(subscription).toBeCalled();
    history.next('/foo');
    expect(hash).toBe('#/foo');
    expect(subscription).toBeCalledTimes(2);
    history.next('/foo/bar');
    expect(hash).toBe('#/foo/bar');
    expect(subscription).toBeCalledTimes(3);
  });
  test('check_hash_with_base_url', () => {
    const history = new HistoryHash('base');
    let hash: string | undefined;
    let pathName: string | undefined;
    const subscription = vi.fn((current: Location) => {
      hash = current.hash;
      pathName = current.pathname;
      expect(current.protocol).toBe('http:');
      expect(current.host).toBe('localhost:3000');
    });
    history.location$.subscribe(subscription);
    expect(subscription).toBeCalled();
    expect(pathName).toBe('/base/');
    history.next('/foo');
    expect(hash).toBe('#/foo');
    expect(subscription).toBeCalledTimes(2);
    expect(pathName).toBe('/base/');
    history.next('/foo/bar');
    expect(hash).toBe('#/foo/bar');
    expect(subscription).toBeCalledTimes(3);
  });
  test('check_hash_route_location', () => {
    const history = new HistoryHash();
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
  test('check_hash_route_location_with base_url', () => {
    const history = new HistoryHash('base');
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

