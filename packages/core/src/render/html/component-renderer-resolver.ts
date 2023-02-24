import { htmlElementDefinitionName } from '@core/components/builtIn/html-element.component';
import { listComponentName } from '@core/components/builtIn/list.component';
import { textComponentName } from '@core/components/builtIn/text.component';
import type { Component } from '@core/components/component';
import { container, singleton } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { RendererFactory } from './@types/RendererFactory';

@singleton()
export class ComponentRendererResolver implements IComponentRendererResolver {
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
        if (this.factories[name] == null) {
          const { TextRendererHtml } = await import(
            './components/text-renderer-html'
          );
          container.register(name, TextRendererHtml);

          this.factories[name] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(name);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[name] as RendererFactory;
      }
      case listComponentName: {
        if (this.factories[name] == null) {
          const { ListRendererHtml } = await import(
            './components/list-renderer-html'
          );
          container.register(name, ListRendererHtml);

          this.factories[name] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(name);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[name] as RendererFactory;
      }
      case 'template': {
        if (this.factories[name] == null) {
          const { CustomRendererHtml } = await import(
            './components/cusom-renderer-html'
          );
          container.register(name, CustomRendererHtml);

          this.factories[name] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(name);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[name] as RendererFactory;
      }
      default:
        throw new Error('Not Implemented!');
    }
  }
}
