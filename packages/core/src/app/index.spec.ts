import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { createApp } from '.';

describe('app-tests', () => {
  test('simple text app', async () => {
    const textC = text({ value: ref$('Hello, World!') });
    const el = await createApp(textC).mount('#app');
    expect(el).not.toBeNull();
    expect(el?.outerHTML ?? 'oh-no').toBe('<div id="app">Hello, World!</div>');
  });
});
