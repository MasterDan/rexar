import { describe, expect, test, vi } from 'vitest';
import { RouteLocation } from '../router/route/route-location';
import { HistoryHash } from './hash.history';

/**
 * @vitest-environment jsdom
 */
describe('hash history', () => {
  test('check hash', () => {
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
  test('check hash route location', () => {
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
});
