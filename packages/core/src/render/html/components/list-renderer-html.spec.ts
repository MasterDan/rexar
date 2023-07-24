import { el } from '@core/components/builtIn/element.component';
import { list } from '@core/components/builtIn/list.component';
import { ref$ } from '@rexar/reactivity';
import { container, singleton, useClass } from '@rexar/di';
import { describe, test, expect, beforeAll } from 'vitest';
import { documentRefToken } from '@core/components/module';
import { BindingTargetRole } from '../@types/binding-target';
import { ComponentRendererHtml } from '../component-renderer-html';
import { ComponentRendererResolver } from '../component-renderer-resolver';
import { ListRendererHtml } from './list-renderer-html';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { IDocumentRef } from '../documentRef/@types/IDocumentRef';
import { DocumentRefDev } from '../documentRef/document-ref.dev';

class ListRendererTest extends ListRendererHtml {
  public get comp$() {
    return ref$(this.component$);
  }
}

describe('list-renderer-html', () => {
  beforeAll(() => {
    container
      .createToken('IComponentRendererResolver', useClass(), singleton())
      .provide(ComponentRendererResolver);
    container
      .createToken(
        'IHtmlRenderer',
        useClass<IHtmlRenderer>((c) => [
          c.resolve('IComponentRendererResolver'),
        ]),
      )
      .provide(ComponentRendererHtml);
    documentRefToken.provide(DocumentRefDev);
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
    expect(listRendererOne.comp$.value).toBeUndefined();
    expect(listRendererTwo.comp$.value).toBeUndefined();
    listRendererOne.setComponent(testListOne);

    const listInComponent =
      listRendererOne.comp$.value?.getProp('content').value;
    const checkList = testListOne.getProp('content').value;
    expect(listInComponent).toEqual(checkList);
    expect(listRendererTwo.comp$.value).toBeUndefined();

    listRendererTwo.setComponent(testListTwo);
    const checkComponentOne =
      listRendererOne.comp$.value?.getProp('content').value;
    const checkComponentTwo =
      listRendererTwo.comp$.value?.getProp('content').value;
    const checkListOne2 = testListOne.getProp('content').value;
    const checkListTwo2 = testListTwo.getProp('content').value;
    expect(checkComponentOne).toEqual(checkListOne2);
    expect(checkComponentTwo).toEqual(checkListTwo2);
  });

  test('simple list', async () => {
    const doc = container.resolve<IDocumentRef>('IDocumentRef').document;
    const rootDiv = doc.createElement('div');
    const listRenderer = new ListRendererHtml();
    listRenderer.setComponent(
      list([
        el({ name: 'div', attrs: { class: 'foo' } }),
        el({ name: 'div', attrs: { class: 'bar' } }),
        el({ name: 'span', attrs: { class: 'baz' } }),
      ]),
    );
    listRenderer.target$.value = {
      parentEl: rootDiv,
      target: rootDiv,
      role: BindingTargetRole.Parent,
    };
    await listRenderer.render();
    expect(listRenderer.nextTarget$.value).not.toBeUndefined();
    expect(rootDiv.outerHTML).toBe(
      '<div>' +
        '<div class="foo"></div>' +
        '<div class="bar"></div>' +
        '<span class="baz"></span>' +
        '</div>',
    );
  });
});

