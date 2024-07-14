import { render, unwrap } from '@jsx-next/render';
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

