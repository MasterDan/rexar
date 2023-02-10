import { htmlElementDefinitionName } from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/conmponent';
import { HtmlRendererBase } from '../base/html-renderer-base';
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
    case 'text': {
      const { TextRendererHtml } = await import(
        './components/text-renderer-html'
      );
      return (component: AnyComponent) => new TextRendererHtml(component);
    }
    default:
      throw new Error('Not Implemented!');
  }
}
