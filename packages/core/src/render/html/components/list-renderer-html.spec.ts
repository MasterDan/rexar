import { el } from '@core/components/builtIn/html-element.component';
import { list } from '@core/components/builtIn/list.component';
import { ref$ } from '@core/reactivity/ref';
import { container, delay, Lifecycle } from 'tsyringe';
import { BindingTargetRole } from '../@types/binding-target';
import { ComponentRendererHtml } from '../component-renderer-html';
import { ComponentRendererResolver } from '../component-renderer-resolver';
import { DocumentRef } from '../documentRef';
import { ListRendererHtml } from './list-renderer-html';

class ListRendererTest extends ListRendererHtml {
  public get comp$() {
    return ref$(this.component$);
  }
}

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
  test('component leak tests', () => {
    const listRendererOne = new ListRendererTest();
    const listRendererTwo = new ListRendererTest();
    const testListOne = list([
      el({ name: 'div', attrs: { class: 'foo' } }),
      el({ name: 'div', attrs: { class: 'bar' } }),
      el({ name: 'span', attrs: { class: 'baz' } }),
    ]);
    const testListTwo = list([
      el({ name: 'div', attrs: { class: 'bar-2' } }),
      el({ name: 'span', attrs: { class: 'baz-2' } }),
    ]);
    expect(listRendererOne.comp$.val).toBeUndefined();
    expect(listRendererTwo.comp$.val).toBeUndefined();
    listRendererOne.setComponent(testListOne);

    const listInComponent = listRendererOne.comp$.val?.getProp('content').val;
    const checkList = testListOne.getProp('content').val;
    expect(listInComponent).toEqual(checkList);
    expect(listRendererTwo.comp$.val).toBeUndefined();

    listRendererTwo.setComponent(testListTwo);
    const checkComponentOne = listRendererOne.comp$.val?.getProp('content').val;
    const checkComponentTwo = listRendererTwo.comp$.val?.getProp('content').val;
    const checkListOne2 = testListOne.getProp('content').val;
    const checkListTwo2 = testListTwo.getProp('content').val;
    expect(checkComponentOne).toEqual(checkListOne2);
    expect(checkComponentTwo).toEqual(checkListTwo2);
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
