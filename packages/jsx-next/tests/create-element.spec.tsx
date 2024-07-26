import { render, raw } from '@jsx-next/render';
import { ref } from '@rexar/reactivity';
import { wait } from '@rexar/tools';
import { describe, expect, test } from 'vitest';

/**
 * @vitest-environment jsdom
 */
describe('create-element', () => {
  test('simple-div', () => {
    const root = raw(<div></div>);
    const App = () => <div>Hello World</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(raw(<div>Hello World</div>).outerHTML);
  });
  test('div-with-dynamic-observable-text', () => {
    const text$ = ref('Hello World');
    const root = raw(<div></div>);
    const App = () => <div>{text$}</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(raw(<div>Hello World</div>).outerHTML);
    text$.value = 'Hello Universe';
    expect(root.innerHTML).toBe(raw(<div>Hello Universe</div>).outerHTML);
  });
  test('div-with-dynamic-computed', async () => {
    const text$ = ref('Hello World');
    const root = raw(<div></div>);
    const App = () => <div>{() => text$.value}</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(raw(<div>Hello World</div>).outerHTML);
    text$.value = 'Hello Universe';
    await wait(25);
    expect(root.innerHTML).toBe(raw(<div>Hello Universe</div>).outerHTML);
  });
  test('div-with-children', () => {
    const root = raw(<div></div>);
    const App = () => (
      <div>
        <span>foo</span>
        <span>bar</span>
      </div>
    );
    render(<App />).into(root);
    expect(root.innerHTML).toBe(
      raw(
        <div>
          <span>foo</span>
          <span>bar</span>
        </div>,
      ).outerHTML,
    );
  });
  test('set-attribute', () => {
    const root = raw(<div></div>);
    const App = () => <span id="123">123</span>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(raw(<span id="123">123</span>).outerHTML);
  });
  test('set-reactive-attribute', () => {
    const root = raw(<div></div>);
    const id$ = ref('123');
    const App = () => <span id={id$}>123</span>;
    render(<App />).into(root);
    throw new Error('Not Implemented!');
  });
  test('set-class', () => {
    const root = raw(<div></div>);
    const class$ = ref('bar');
    const show$ = ref(true);
    const classllist$ = ref();
    const App = () => (
      <div>
        <span class="foo1"></span>
        <span class={class$}></span>
        <span className="foo2"></span>
        <span
          classList={{
            foo: show$,
          }}
        ></span>
      </div>
    );
    render(<App />).into(root);
    throw new Error('Not Implemented!');
  });
});

