import { el } from '@core/components/builtIn/html-element.component';
import { list } from '@core/components/builtIn/list.component';
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
      '<div id="app"><div><span>hello</span><span>world</span></div></div>',
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
        '<template></template>' +
        'bar' +
        '<template></template>' +
        'baz' +
        '</div>',
    );
    bar.val = 'barChanged';
    expect(elApp?.outerHTML).toBe(
      '<div id="app">' +
        'foo' +
        '<template></template>' +
        'barChanged' +
        '<template></template>' +
        'baz' +
        '</div>',
    );
  });
});
