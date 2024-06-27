import { beforeEach, describe, expect, test } from 'vitest';
import { Comment, render } from '@rexar/core';
import { wait } from '@rexar/tools';
import { history } from '../history';
import { useRoute } from './use-route';
import { createRouter, router$ } from '.';
import { RouterView } from '../components/RouterView';

/**
 * @vitest-environment jsdom
 */
describe('router', () => {
  beforeEach(() => {
    router$.next(undefined);
    window.history.pushState({}, '', '/');
  });
  test('simple_routes', async () => {
    const router = createRouter({
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
    router.setLocation({
      name: 'foo',
    });
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
    router.setLocation({
      path: '/base',
    });
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
    router.setLocation({
      path: 'bar',
    });
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
    router.setLocation({
      path: '',
    });
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
  test('routes_with_params', async () => {
    const router = createRouter({
      history,
      routes: [
        {
          path: '/',
          render: () => <div>Base</div>,
        },
        {
          path: '/foo/:id',
          name: 'foo',
          render: () => {
            const id = useRoute().useParam('id', 'id not found');
            return <div>Foo: {id}</div>;
          },
        },
        {
          path: '/bar/:id/:name',
          name: 'bar',
          render: () => {
            const { useParam } = useRoute();
            const id = useParam('id', 'id not found');
            const name = useParam('name', 'name not found');
            return (
              <div>
                Bar: {id} | {name}
              </div>
            );
          },
        },
      ],
    });
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
    // explicit id
    router.setLocation({
      name: 'foo',
      params: {
        id: '123',
      },
    });
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Foo: 123</div>
        </div>
      ).outerHTML,
    );
    // implicit id
    router.setLocation({
      path: 'foo/234',
    });
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Foo: 234</div>
        </div>
      ).outerHTML,
    );
    // mix explicit and implicit params
    router.setLocation({
      path: '/bar/1/:name',
      params: { name: 'danny' },
    });
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Bar: 1 | danny</div>
        </div>
      ).outerHTML,
    );
    router.setLocation({
      name: 'bar',
      params: { name: 'john', id: '2' },
    });
    await wait(100);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div>Bar: 2 | john</div>
        </div>
      ).outerHTML,
    );
  });
});

