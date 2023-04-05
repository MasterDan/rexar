import { IElementComponentProps } from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/component';
import { parseHtml } from '@core/parsers/html';
// @ts-expect-error module exists
import templateOne from './template-one.html';

describe('html-parser', () => {
  test('template-one', async () => {
    const tree = await parseHtml(templateOne);
    expect(tree.length).toBe(1);
    const first = tree[0] as Component<IElementComponentProps>;
    const children = first.getProp('children');
    expect(Array.isArray(children)).toBe(true);
    const lorem = children?.find((c) => c.id === '#lorem');
    expect(lorem).not.toBeUndefined();
  });
});
