import { IElementComponentProps } from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/component';
import { parseHtml } from '@core/parsers/html';
// @ts-expect-error module exists
import templateOne from './template-one.html';
// @ts-expect-error module exists
import templateTwo from './template-two.html';
// @ts-expect-error module exists
import templateMulti from './template-multi.html';

describe('html-parser', () => {
  test('template-one', async () => {
    const templates = await parseHtml(templateOne);
    const tree = templates.default;
    expect(tree.length).toBe(1);
    const first = tree[0] as Component<IElementComponentProps>;
    const children = first.getProp('children');
    expect(Array.isArray(children)).toBe(true);
    const lorem = children?.find((c) => c.id === 'lorem');
    expect(lorem).not.toBeUndefined();
  });
  test('template-two', async () => {
    const templates = await parseHtml(templateTwo);
    const tree = templates.default;
    expect(tree.length).toBe(4);
    expect(tree[0].getProp('children').length).toBe(5);
    expect(tree[1].getProp('value').val.trim()).toBe('one');
    expect(tree[2].getProp('children').length).toBe(2);
    expect(tree[3].getProp('value').val.trim()).toBe('two');
  });
  test('template-multi', async () => {
    const templates = await parseHtml(templateMulti);
    const defaultTemplate = templates.default;
    expect(defaultTemplate.length).toBe(1);
    const first = defaultTemplate[0] as Component<IElementComponentProps>;
    const children = first.getProp('children');
    expect(Array.isArray(children)).toBe(true);
    const lorem = children?.find((c) => c.id === 'lorem');
    expect(lorem).not.toBeUndefined();

    const { inner } = templates.inner;
    expect(inner.length).toBe(4);
    expect(inner[0].getProp('children').length).toBe(5);
    expect(inner[1].getProp('value').val.trim()).toBe('one');
    expect(inner[2].getProp('children').length).toBe(2);
    expect(inner[3].getProp('value').val.trim()).toBe('two');
  });
});
