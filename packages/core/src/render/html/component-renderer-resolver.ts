import { htmlElementDefinitionName } from '@/components/builtIn/html-element.component';
import { Component } from '@/components/conmponent';
import { IHtmlRenderer } from './@types/IRenderer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = Component<any>;

export type RendererFactory = (component: AnyComponent) => IHtmlRenderer;

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
