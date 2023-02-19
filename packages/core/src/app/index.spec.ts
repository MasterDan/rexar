import { el } from '@core/components/builtIn/html-element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { createApp } from '.';

describe('app-tests', () => {
  test('simple text app', async () => {
    const textC = text({ value: ref$('Hello, World!') });
    const elApp = await createApp(textC).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML ?? 'oh-no').toBe(
      '<div id="app">Hello, World!</div>',
    );
  });
  test('simple-html-element', async () => {
    const elRoot = el({
      name: 'div',
    });
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML ?? 'oh-no').toBe('<div id="app"><div></div></div>');
  });
  test('html-element-with-text', async () => {
    const elRoot = el({
      name: 'div',
      children: [text({ value: ref$('Hello, World!') })],
    });
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML ?? 'oh-no').toBe(
      '<div id="app"><div>Hello, World!</div></div>',
    );
  });
  test('html-element-with-children', async () => {
    const elRoot = el({
      name: 'div',
      children: [
        el({
          name: 'span',
          children: [text({ value: ref$('hello') })],
        }),
        el({
          name: 'span',
          children: [text({ value: ref$('world') })],
        }),
      ],
    });
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML ?? 'oh-no').toBe(
      '<div id="app"><div><span>hello</span><span>world</span></div></div>',
    );
  });
});
