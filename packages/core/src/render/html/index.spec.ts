import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { container } from 'tsyringe';
import { BindingTargetRole } from './@types/binding-target';
import { DocumentRef } from './documentRef';
import { render } from './render';

describe('render some html', () => {
  test('simple text', async () => {
    const dRef = container.resolve(DocumentRef);
    const doc = await lastValueFrom(dRef.instance$);
    expect(doc.body.innerHTML).toBe('<div id="app"></div>');
    const app = doc.querySelector('#app');
    expect(app).not.toBeNull();
    if (!app) {
      return;
    }
    const textC = text({ value: ref$('Hello, World!') });
    await render(textC, {
      role: BindingTargetRole.Parent,
      parentEl: app,
      target: app,
    });
    expect(app.outerHTML).toBe('<div id="app">Hello, World!</div>');
  });
});
