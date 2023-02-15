import { htmlElementDefinitionName } from '@core/components/builtIn/html-element.component';
import { listComponentName } from '@core/components/builtIn/list.component';
import { textComponentName } from '@core/components/builtIn/text.component';
import type { Component } from '@core/components/conmponent';
import { container, singleton } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { AnyComponent } from './@types/any-component';

export type RendererFactory = (component: AnyComponent) => HtmlRendererBase;

@singleton()
export class ComponentRendererResolver {
  private factories: Record<string, RendererFactory | undefined> = {};

  async resolveRenderer({ name }: Component): Promise<RendererFactory> {
    switch (name) {
      case htmlElementDefinitionName: {
        if (this.factories[name] == null) {
          const { ElementRendererHtml } = await import(
            './components/element-renderer-html'
          );
          container.register(name, ElementRendererHtml);

          this.factories[name] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(name);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[name] as RendererFactory;
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
}
