import { render } from '@jsx-next/render';
import { describe, expect, test } from 'vitest';

/**
 * @vitest-environment jsdom
 */
describe('create-element', () => {
  test('should work', () => {
    const root = document.createElement('div');
    const App = () => <div>Hello World</div>;
    render(<App />).into(root);
    expect(root.innerHTML).toBe('<div>Hello World</div>');
  });
});

