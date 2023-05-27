import type { Component } from '@core/components/component';
import { container, singleton } from 'tsyringe';
import { ComponentType } from '@core/components/component-type';
import { HtmlRendererBase } from './base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { RendererFactory } from './@types/RendererFactory';

@singleton()
export class ComponentRendererResolver implements IComponentRendererResolver {
  private factories: Partial<Record<ComponentType, RendererFactory>> = {};

  async resolveRenderer({ type }: Component): Promise<RendererFactory> {
    switch (type) {
      case ComponentType.HTMLElement: {
        if (this.factories[type] == null) {
          const { ElementRendererHtml } = await import(
            './components/element-renderer-html'
          );
          container.register(type, ElementRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      case ComponentType.Text: {
        if (this.factories[type] == null) {
          const { TextRendererHtml } = await import(
            './components/text-renderer-html'
          );
          container.register(type, TextRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      case ComponentType.List: {
        if (this.factories[type] == null) {
          const { ListRendererHtml } = await import(
            './components/list-renderer-html'
          );
          container.register(type, ListRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      case ComponentType.CustomTemplate: {
        if (this.factories[type] == null) {
          const { CustomRendererHtml } = await import(
            './components/cusom-renderer-html'
          );
          container.register(type, CustomRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      case ComponentType.Conditional: {
        if (this.factories[type] == null) {
          const { ConditionalRendererHtml } = await import(
            './components/conditional-renderer-html'
          );
          container.register(type, ConditionalRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      case ComponentType.Dynamic: {
        if (this.factories[type] == null) {
          const { DynamicRendererHtml } = await import(
            './components/dynamic-renderer-html'
          );
          container.register(type, DynamicRendererHtml);

          this.factories[type] = (component: AnyComponent) => {
            const renderer = container.resolve<HtmlRendererBase>(type);
            renderer.setComponent(component);
            return renderer;
          };
        }
        return this.factories[type] as RendererFactory;
      }
      default:
        throw new Error(`Unexpected component type: "${type}"`);
    }
  }
}
