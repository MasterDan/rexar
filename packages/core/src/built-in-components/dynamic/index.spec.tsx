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
    document.body.appendChild(root);
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
  test('dynamic with children', () => {
    const [Dynamic, change] = useDynamic(({ children }) => (
      <div>{children}</div>
    ));
    const root = (
      <div>
        <Dynamic>
          <span>children</span>
        </Dynamic>
      </div>
    );
    document.body.appendChild(root);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <div>
            <span>children</span>
          </div>
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
    change(({ children }) => <>{children}</>);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="dynamic-anchor" />
          <span>children</span>
        </div>
      ).outerHTML,
    );
  });
});
