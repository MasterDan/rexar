import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { container } from 'tsyringe';
import { HtmlRenderer } from '.';
import { DocumentRef } from './documentRef';

describe('render some html', () => {
  test('simple text', async () => {
    const dRef = container.resolve(DocumentRef);
    const doc = await dRef.instance$;
    expect(doc.body.innerHTML).toBe('<div id="app"></div>');
    const app = doc.querySelector('#app');
    expect(app).not.toBeNull();
    if (!app) {
      return;
    }
    const htmlRenderer = container.resolve(HtmlRenderer);
    const textC = text({ value: ref$('Hello, World!') });
    await htmlRenderer.render(textC, app);
    expect(app.outerHTML).toBe('<div id="app">Hello, World!</div>');
  });
});
