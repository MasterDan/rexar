import { IComponentDefinitionBuilder } from '@core/components/@types/IComponentDefinitionBuilder';
import { conditional } from '@core/components/builtIn/conditional.component';
import { dynamic } from '@core/components/builtIn/dynamic.component';
import { el } from '@core/components/builtIn/element.component';
import { list } from '@core/components/builtIn/list.component';
import { text } from '@core/components/builtIn/text.component';
import { ComponentDefinitionBuilder } from '@core/components/component-definition-builder';
import { ref$ } from '@rexar/reactivity';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import { lastValueFrom, timer } from 'rxjs';
import { container, singleton, useClass } from '@rexar/di';
import { refStoreToken } from '@core/render/html/component-renderer-resolver';
import { createApp } from '.';

describe('app-tests', () => {
  beforeEach(() => {
    container
      .createToken(
        'IComponentDefinitionBuilder',
        useClass<IComponentDefinitionBuilder>(),
        singleton(),
      )
      .provide(ComponentDefinitionBuilder);
    const store = refStoreToken.resolve();
    store.beginScope('test-scope', ref$(ComponentLifecycle.Created));
  });
  afterEach(() => {
    const store = refStoreToken.resolve();
    store.endScope();
  });
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

  test('list-test', async () => {
    const elRoot = list([
      el({ name: 'div', attrs: { class: 'foo' } }),
      el({ name: 'span', attrs: { class: 'bar' } }),
      el({ name: 'div', attrs: { class: 'baz' } }),
    ]);
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<div class="foo"></div>' +
        '<span class="bar"></span>' +
        '<div class="baz"></div>' +
        '</div>',
    );
  });
  test('inner-list-test', async () => {
    const elRoot = list([
      el({
        name: 'div',
        attrs: { class: 'foo' },
        children: [
          el({ name: 'span', attrs: { class: 'foo-foo' } }),
          el({ name: 'span', attrs: { class: 'foo-bar' } }),
        ],
      }),
      el({ name: 'span', attrs: { class: 'bar' } }),
      el({ name: 'span', attrs: { class: 'bar2' } }),
      el({
        name: 'div',
        attrs: { class: 'baz' },
        children: [
          el({ name: 'span', attrs: { class: 'baz-foo' } }),
          el({ name: 'span', attrs: { class: 'baz-bar' } }),
        ],
      }),
    ]);
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<div class="foo">' +
        '<span class="foo-foo"></span>' +
        '<span class="foo-bar"></span>' +
        '</div>' +
        '<span class="bar"></span>' +
        '<span class="bar2"></span>' +
        '<div class="baz">' +
        '<span class="baz-foo"></span>' +
        '<span class="baz-bar"></span>' +
        '</div>' +
        '</div>',
    );
  });
  test('list of lists', async () => {
    const elRoot = list([
      list([
        el({ name: 'span', attrs: { class: 'foo-foo' } }),
        el({ name: 'span', attrs: { class: 'foo-bar' } }),
      ]),
      list([
        el({ name: 'div', attrs: { class: 'foo' } }),
        el({ name: 'span', attrs: { class: 'bar' } }),
        el({ name: 'div', attrs: { class: 'baz' } }),
      ]),
      text({ value: ref$('hello') }),
    ]);

    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<span class="foo-foo"></span>' +
        '<span class="foo-bar"></span>' +
        '<div class="foo"></div>' +
        '<span class="bar"></span>' +
        '<div class="baz"></div>' +
        'hello' +
        '</div>',
    );
  });
  test('simple-html-element-with-children', async () => {
    const elRoot = el({
      name: 'div',
      children: [
        el({
          name: 'div',
          attrs: { class: 'foo' },
          children: [
            el({
              name: 'span',
              attrs: { class: 'foo-bar' },
            }),
            el({
              name: 'span',
              attrs: { class: 'foo-baz' },
            }),
          ],
        }),
        el({
          name: 'span',
          attrs: { class: 'bar' },
        }),
        el({
          name: 'span',
          attrs: { class: 'baz' },
        }),
      ],
    });
    const elApp = await createApp(elRoot).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML ?? 'oh-no').toBe(
      '<div id="app"><div>' +
        '<div class="foo">' +
        '<span class="foo-bar"></span>' +
        '<span class="foo-baz"></span>' +
        '</div>' +
        '<span class="bar"></span>' +
        '<span class="baz"></span>' +
        '</div></div>',
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
      '<div id="app">' +
        '<div>' +
        '<span>hello</span>' +
        '<span>world</span>' +
        '</div>' +
        '</div>',
    );
  });
  test('div-with-inputs', async () => {
    const root = list([
      el({
        name: 'div',
        children: [el({ name: 'input', attrs: { type: 'text' } })],
      }),
      text({ value: ref$('foo') }),
    ]);
    const elApp = await createApp(root).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<div>' +
        '<input type="text">' +
        '</div>' +
        'foo' +
        '</div>',
    );
  });
  test('multiple-text-nodes', async () => {
    const bar = ref$('bar');
    const root = list([
      text({ value: ref$('foo') }),
      text({ value: bar }),
      text({ value: ref$('baz') }),
    ]);
    const elApp = await createApp(root).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        'foo' +
        '<!--end of text-->' +
        'bar' +
        '<!--end of text-->' +
        'baz' +
        '</div>',
    );
    bar.value = 'barChanged';
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        'foo' +
        '<!--end of text-->' +
        'barChanged' +
        '<!--end of text-->' +
        'baz' +
        '</div>',
    );
  });
  test('dynamic component: start from undefined', async () => {
    const component$ = ref$<AnyComponent>();
    const first = el({
      name: 'span',
      attrs: { class: 'foo' },
    });
    const second = el({
      name: 'div',
      attrs: { class: 'bar' },
    });
    const root = dynamic(component$);
    const elApp = await createApp(root).mount('#app');
    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe('<div id="app"></div>');
    const wait = () => lastValueFrom(timer(100));
    component$.value = first;
    await wait();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><span class="foo"></span></div>',
    );
    component$.value = second;
    await wait();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div class="bar"></div></div>',
    );
  });
  test('dynamic component: start from component', async () => {
    const first = el({
      name: 'span',
      attrs: { class: 'foo' },
    });
    const second = el({
      name: 'div',
      attrs: { class: 'bar' },
    });
    const third = list([
      el({ name: 'span', attrs: { class: 'l-foo' } }),
      text({ value: ref$('text') }),
      el({ name: 'span', attrs: { class: 'l-bar' } }),
    ]);
    const wait = () => lastValueFrom(timer(100));
    const component$ = ref$<AnyComponent | undefined>(first);
    const root = dynamic(component$);
    const elApp = await createApp(root).mount('#app');

    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><span class="foo"></span></div>',
    );
    component$.value = second;
    await wait();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div class="bar"></div></div>',
    );
    component$.value = third;
    await wait();
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        '<span class="l-foo"></span>' +
        'text' +
        '<!--end of text-->' +
        '<span class="l-bar"></span>' +
        '</div>',
    );
    component$.value = undefined;
    await wait();
    expect(elApp?.outerHTML).toBe('<div id="app"></div>');
  });
  test('conditional component', async () => {
    const condition = ref$(true);
    const ifTrue = el({ name: 'div', attrs: { class: 'foo' } });
    const iFalse = el({ name: 'div', attrs: { class: 'bar' } });
    const root = conditional(
      condition,
      ref$<AnyComponent | undefined>(ifTrue),
      ref$<AnyComponent | undefined>(iFalse),
    );
    const elApp = await createApp(root).mount('#app');
    const wait = () => lastValueFrom(timer(100));

    expect(elApp).not.toBeNull();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div class="foo"></div></div>',
    );
    condition.value = false;
    await wait();
    expect(elApp?.outerHTML).toBe(
      '<div id="app"><div class="bar"></div></div>',
    );
  });
});

