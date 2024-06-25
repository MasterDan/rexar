import { describe, expect, test } from 'vitest';
import { Comment, render } from '@rexar/core';
import { wait } from '@rexar/tools';
import { Router } from './router';
import { history } from '../history';
import { RouteLocation } from '../route/route-location';

/**
 * @vitest-environment jsdom
 */
describe('router', () => {
  test('simple_routes', async () => {
    const router = new Router({
      history,
      routes: [
        {
          path: '/',
          render: () => <div>Base</div>,
        },
        {
          path: '/foo',
          name: 'foo',
          render: () => <div>Foo</div>,
        },
        {
          path: '/bar',
          name: 'bar',
          render: () => <div>Bar</div>,
        },
        {
          path: '/base',
          redirect: { path: '/' },
        },
      ],
    });
    const [RouterView] = router.createComponents();
    const root = <div></div>;
    document.body.appendChild(root);
    render(RouterView).into(root);
    // initial path
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Base</div>
        </div>
      ).outerHTML,
    );
    // to name 'foo'
    router.setLocation(
      new RouteLocation({
        name: 'foo',
      }),
    );
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Foo</div>
        </div>
      ).outerHTML,
    );
    // redirect to base
    router.setLocation(
      new RouteLocation({
        path: '/base',
      }),
    );
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Base</div>
        </div>
      ).outerHTML,
    );
    // to path 'bar'
    router.setLocation(
      new RouteLocation({
        path: 'bar',
      }),
    );
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Bar</div>
        </div>
      ).outerHTML,
    );
    // back to base
    router.setLocation(
      new RouteLocation({
        path: '',
      }),
    );
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Base</div>
        </div>
      ).outerHTML,
    );
  });
});
