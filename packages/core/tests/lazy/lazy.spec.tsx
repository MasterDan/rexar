import { defineComponent, render } from '@core/component';
import { Comment, defineLazyComponent, ref } from '@core/index';
import { wait } from '@rexar/tools';
import { describe, expect, test } from 'vitest';

/**
 * @vitest-environment jsdom
 */
describe('lazy-components', () => {
  test('simple-lazy', async () => {
    const root = <div></div>;
    const TestLazy = defineLazyComponent(
      () => import('./TestComponent').then((x) => x.default),
      {
        timeout: 500,
        fallback: () => <>Loading...</>,
      },
    );
    const prop = 'Hello';
    const prop$ = ref('World');
    const App = defineComponent(() => <TestLazy prop={prop} prop$={prop$} />);
    render(App).into(root);
    const loadingHtml = (
      <div>
        <Comment text="dynamic-anchor" />
        Loading...
      </div>
    ).outerHTML;
    const loadedHtml = (
      <div>
        <Comment text="dynamic-anchor" />
        <div>Hello, World</div>
      </div>
    ).outerHTML;
    expect(root.outerHTML).toBe(loadingHtml);
    await wait(450);
    expect(root.outerHTML).toBe(loadingHtml);
    await wait(100);
    expect(root.outerHTML).toBe(loadedHtml);
    prop$.value = 'Danny';
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <div>Hello, Danny</div>
        </div>
      ).outerHTML,
    );
  });
});

