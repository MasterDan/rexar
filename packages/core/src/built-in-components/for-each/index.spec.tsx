import { describe, expect, test } from 'vitest';
import { ref } from '@rexar/reactivity';
import { h, fragment } from '@rexar/jsx';
import { defineComponent, render } from '@core/component';
import { wait } from '@rexar/tools';
import { useFor } from '.';
import { Comment } from '../comment';

/**
 * @vitest-environment jsdom
 */
describe('for-each rendering', () => {
  test('array of strings', async () => {
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
    await wait(50);
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
  test('array-of-strings-in-fragment', async () => {
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
    document.body.appendChild(root);
    await wait(50);
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
  test('remove-array', async () => {
    const arr$ = ref(['foo', 'bar', 'baz']);
    const List = useFor(arr$, (item) => item);
    const root = <div></div>;
    document.body.appendChild(root);
    const TestList = defineComponent(() => (
      <List each={({ item }) => <span>{item}</span>}></List>
    ));
    const { remove } = render(TestList).into(root);
    await wait(50);
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>foo</span>
          <Comment text="end-of-element"></Comment>
          <span>bar</span>
          <Comment text="end-of-element"></Comment>
          <span>baz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    arr$.value.push('xyz');
    expect(root.outerHTML).toBe(
      (
        <div>
          <Comment text="foreach-anchor"></Comment>
          <span>foo</span>
          <Comment text="end-of-element"></Comment>
          <span>bar</span>
          <Comment text="end-of-element"></Comment>
          <span>baz</span>
          <Comment text="end-of-element"></Comment>
          <span>xyz</span>
          <Comment text="end-of-element"></Comment>
        </div>
      ).outerHTML,
    );
    remove();
    expect(root.outerHTML).toBe((<div></div>).outerHTML);
  });
  test('swap-elements', async () => {
    const root = <div></div>;
    document.body.appendChild(root);
    const arr$ = ref(['foo', 'bar', 'baz', 'x']);
    const List = useFor(arr$, (i) => i);
    const TestComp = defineComponent(() => (
      <List each={({ item }) => <span>{item}</span>}></List>
    ));
    render(TestComp).into(root);
    await wait(50);
    console.log(root.outerHTML);
    arr$.value = ['foo', 'baz', 'bar', 'x'];
    console.log(root.outerHTML);
  });
});
