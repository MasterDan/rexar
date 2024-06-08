import { render } from '@core/component';
import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { wait } from '@rexar/tools';
import { Tag } from './Tag';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('custom tag', () => {
  test('should change name', async () => {
    const root = <div></div>;
    document.body.appendChild(root);
    const name$ = ref('div');
    const el$ = ref<Element>();
    render(() => (
      <Tag name={name$} attrs={{ class: 'foo' }} el$={el$}>
        <span>Content</span>
      </Tag>
    )).into(root);
    await wait(50);
    expect(el$.value?.outerHTML).toBe(
      (
        <div class="foo">
          <span>Content</span>
        </div>
      ).outerHTML,
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <div class="foo">
            <span>Content</span>
          </div>
        </div>
      ).outerHTML,
    );
    name$.value = 'section';
    await wait(50);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor"></Comment>
          <section class="foo">
            <span>Content</span>
          </section>
        </div>
      ).outerHTML,
    );
    expect(el$.value?.outerHTML).toBe(
      (
        <section class="foo">
          <span>Content</span>
        </section>
      ).outerHTML,
    );
  });
});

