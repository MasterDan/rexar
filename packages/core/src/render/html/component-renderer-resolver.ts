import type { Component } from '@core/components/component';
import { container, singleton } from 'tsyringe';
import { ComponentType } from '@core/components/component-type';
import { HtmlRendererBase } from './base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { RendererFactory } from './@types/RendererFactory';
import { ElementRendererHtml } from './components/element-renderer-html';
import { TextRendererHtml } from './components/text-renderer-html';
import { ListRendererHtml } from './components/list-renderer-html';
import { CustomRendererHtml } from './components/custom/custom-template-renderer-html';
import { ConditionalRendererHtml } from './components/conditional-renderer-html';
import { DynamicRendererHtml } from './components/dynamic-renderer-html';

@singleton()
export class ComponentRendererResolver implements IComponentRendererResolver {
  private factories: Partial<Record<ComponentType, RendererFactory>> = {};

  async resolveRenderer({ type }: Component): Promise<RendererFactory> {
    switch (type) {
      case ComponentType.HTMLElement: {
        if (this.factories[type] == null) {
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

