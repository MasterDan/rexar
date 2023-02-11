import { htmlElementDefinitionName } from '@core/components/builtIn/html-element.component';
import { listComponentName } from '@core/components/builtIn/list.component';
import { textComponentName } from '@core/components/builtIn/text.component';
import type { Component } from '@core/components/conmponent';
import type { HtmlRendererBase } from '../base/html-renderer-base';
import { AnyComponent } from './@types/any-component';

export type RendererFactory = (component: AnyComponent) => HtmlRendererBase;

export async function resolveRenderer({
  name,
}: Component): Promise<RendererFactory> {
  switch (name) {
    case htmlElementDefinitionName: {
      const { ElementRendererHtml } = await import(
        './components/element-renderer-html'
      );
      return (component: AnyComponent) => new ElementRendererHtml(component);
    }
    case textComponentName: {
      const { TextRendererHtml } = await import(
        './components/text-renderer-html'
      );
      return (component: AnyComponent) => new TextRendererHtml(component);
    }
    case listComponentName: {
      // eslint-disable-next-line import/no-cycle
      const { ListRendererHtml } = await import(
        './components/list-renderer-html'
      );
      return (component: AnyComponent) => new ListRendererHtml(component);
    }
    default:
      throw new Error('Not Implemented!');
  }
}
