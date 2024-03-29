import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { h, fragment } from '@rexar/jsx';
import { useFor } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('for-each rendering', () => {
  test('array of strings', () => {
    const array = ref(['foo', 'bar']);
    const Strings = useFor<string>(array, (i) => i);
    const root = (
      <div>
        <Strings
          each={({ item, index }) => (
            <span>
              {index}: {item}
            </span>
          )}
        ></Strings>
      </div>
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>0: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>1: bar</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['foo', 'new', 'bar'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>0: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>1: new</span>
          <Comment text="end-of-element"></Comment>
          <span>2: bar</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['foo', 'bar', 'baz'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>0: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>1: bar</span>
          <Comment text="end-of-element"></Comment>
          <span>2: baz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['baz'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>0: baz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = [];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
        </div>
      ).outerHTML,
    );
  });
  test('array of strings in fragment', () => {
    const array = ref(['foo', 'bar']);
    const Strings = useFor(array, (i) => i);
    const root = (
      <div>
        <Strings
          each={({ item, index }) => (
            <>
              <span>index: {index}</span>
              <span>item: {item}</span>
            </>
          )}
        ></Strings>
      </div>
    );
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>index: 0</span>
          <span>item: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>index: 1</span>
          <span>item: bar</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['foo', 'new', 'bar'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>index: 0</span>
          <span>item: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>index: 1</span>
          <span>item: new</span>
          <Comment text="end-of-element"></Comment>
          <span>index: 2</span>
          <span>item: bar</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['foo', 'bar', 'baz'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>index: 0</span>
          <span>item: foo</span>
          <Comment text="end-of-element"></Comment>
          <span>index: 1</span>
          <span>item: bar</span>
          <Comment text="end-of-element"></Comment>
          <span>index: 2</span>
          <span>item: baz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = ['baz'];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>index: 0</span>
          <span>item: baz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    array.value = [];
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
        </div>
      ).outerHTML,
    );
  });
});
