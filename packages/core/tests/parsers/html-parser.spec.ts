import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { Component } from '@core/components/component';
import { templateParser } from '@core/parsers/html';
import { ComponentDefinitionBuilder } from '@core/components/component-definition-builder';
import { describe, test, expect, beforeEach } from 'vitest';
import { resolveNodes } from '@core/parsers/html/node-resolver/resolve-nodes.dev';
import {
  componentDefinitionBuilderToken,
  nodeResolverToken,
} from '@core/components/module';
import templateOne from './template-one.html?raw';
import templateTwo from './template-two.html?raw';
import templateMulti from './template-multi.html?raw';

describe('html-parser', () => {
  beforeEach(() => {
    componentDefinitionBuilderToken.provide(ComponentDefinitionBuilder);
    nodeResolverToken.provide(resolveNodes);
  });
  test('template-one', async () => {
    const templates = await templateParser.fromString(templateOne);
    const tree = templates.default;
    expect(tree.length).toBe(1);
    const first = tree[0] as Component<IElementComponentProps>;
    const children = first.getProp('children');
    expect(Array.isArray(children)).toBe(true);
    const lorem = children?.find((c) => c.id === 'lorem');
    expect(lorem).not.toBeUndefined();
  });
  test('template-two', async () => {
    const templates = await templateParser.fromString(templateTwo);
    const tree = templates.default;
    expect(tree.length).toBe(4);
    expect(tree[0].getProp('children').length).toBe(5);
    expect(tree[1].getProp('value').value.trim()).toBe('one');
    expect(tree[2].getProp('children').length).toBe(2);
    expect(tree[3].getProp('value').value.trim()).toBe('two');
  });
  test('template-multi', async () => {
    const templates = await templateParser.fromString(templateMulti);
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
    expect(inner[1].getProp('value').value.trim()).toBe('one');
    expect(inner[2].getProp('children').length).toBe(2);
    expect(inner[3].getProp('value').value.trim()).toBe('two');
  });
});
