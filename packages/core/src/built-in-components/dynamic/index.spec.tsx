import { h, fragment } from '@rexar/jsx';
import { describe, expect, test } from 'vitest';
import { useDynamic } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('dynamic renderer', () => {
  test('dynamic renderer simple', () => {
    const [Dynamic, change] = useDynamic(() => <span>Foo</span>);

    const root = (
      <div>
        <Dynamic></Dynamic>
      </div>
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <span>Foo</span>
        </div>
      ).outerHTML,
    );
    change(() => (
      <>
        <span>bar</span>
        <span>baz</span>
      </>
    ));
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <span>bar</span>
          <span>baz</span>
        </div>
      ).outerHTML,
    );
    change(() => <div>Some text</div>);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <div>Some text</div>
        </div>
      ).outerHTML,
    );
  });
});
