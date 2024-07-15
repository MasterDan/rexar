import { render, unwrap } from '@jsx-next/render';
import { ref } from '@rexar/reactivity';
import { wait } from '@rexar/tools';
import { describe, expect, test } from 'vitest';

/**
 * @vitest-environment jsdom
 */
describe('create-element', () => {
  test('simple-div', () => {
    const root = unwrap(<div></div>);
    const App = () => <div>Hello World</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(unwrap(<div>Hello World</div>).outerHTML);
  });
  test('div-with-dynamic-observable-text', () => {
    const text$ = ref('Hello World');
    const root = unwrap(<div></div>);
    const App = () => <div>{text$}</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(unwrap(<div>Hello World</div>).outerHTML);
    text$.value = 'Hello Universe';
    expect(root.innerHTML).toBe(unwrap(<div>Hello Universe</div>).outerHTML);
  });
  test('div-with-dynamic-computed', async () => {
    const text$ = ref('Hello World');
    const root = unwrap(<div></div>);
    const App = () => <div>{() => text$.value}</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe(unwrap(<div>Hello World</div>).outerHTML);
    text$.value = 'Hello Universe';
    await wait(25);
    expect(root.innerHTML).toBe(unwrap(<div>Hello Universe</div>).outerHTML);
  });
  test('div-with-children', () => {
    const root = unwrap(<div></div>);
    const App = () => (
      <div>
        <span>foo</span>
        <span>bar</span>
      </div>
    );
    render(<App />).into(root);
    expect(root.innerHTML).toBe(
      unwrap(
        <div>
          <span>foo</span>
          <span>bar</span>
        </div>,
      ).outerHTML,
    );
  });
});

