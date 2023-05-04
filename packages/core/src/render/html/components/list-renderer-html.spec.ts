import { el } from '@core/components/builtIn/html-element.component';
import { list } from '@core/components/builtIn/list.component';
import { container, delay, Lifecycle } from 'tsyringe';
import { BindingTargetRole } from '../@types/binding-target';
import { ComponentRendererHtml } from '../component-renderer-html';
import { ComponentRendererResolver } from '../component-renderer-resolver';
import { DocumentRef } from '../documentRef';
import { ListRendererHtml } from './list-renderer-html';

describe('list-renderer-html', () => {
  beforeAll(() => {
    container.register(
      'IComponentRendererResolver',
      {
        useToken: delay(() => ComponentRendererResolver),
      },
      { lifecycle: Lifecycle.Singleton },
    );

    container.register('IHtmlRenderer', ComponentRendererHtml);
  });
  test('simple list', async () => {
    const docRef = container.resolve(DocumentRef);
    const doc = await docRef.getDocument();
    const rootDiv = doc.createElement('div');
    const listRenderer = new ListRendererHtml();
    listRenderer.setComponent(
      list([
        el({ name: 'div', attrs: { class: 'foo' } }),
        el({ name: 'div', attrs: { class: 'bar' } }),
        el({ name: 'span', attrs: { class: 'baz' } }),
      ]),
    );
    listRenderer.target$.val = {
      parentEl: rootDiv,
      target: rootDiv,
      role: BindingTargetRole.Parent,
    };
    await listRenderer.render();
    expect(listRenderer.nextTarget$.val).not.toBeUndefined();
    expect(rootDiv.outerHTML).toBe(
      '<div>' +
        '<div class="foo"></div>' +
        '<div class="bar"></div>' +
        '<span class="baz"></span>' +
        '</div>',
    );
  });
});
