import type { Component } from '@core/components/component';
import { container, multiple, singleton, useClass } from '@rexar/di';
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
import { RefStore } from './ref-store/ref-store';
import { IHookHandler } from './components/custom/hook-handlers/base/hook-handler';
import { ElementReferenceHookHandler } from './components/custom/hook-handlers/element-reference-hook-handler';
import { PickTemplateHookHandler } from './components/custom/hook-handlers/pick-template-hook-handler';
import { LifecycleHookHandler } from './components/custom/hook-handlers/lifecycle-hook-handler';
import { TransformHookHandler } from './components/custom/hook-handlers/transform-hook-handler';
import { RefStoreMemo } from './ref-store/ref-store-memo';

export const refStoreToken = container.createToken(
  'RefStore',
  useClass<RefStore>(),
  singleton(),
);
refStoreToken.provide(RefStore);

export class ComponentRendererResolver implements IComponentRendererResolver {
  private factories: Partial<Record<ComponentType, RendererFactory>> = {};

  async resolveRenderer({ type }: Component): Promise<RendererFactory> {
    switch (type) {
      case ComponentType.HTMLElement: {
        if (this.factories[type] == null) {
          container
            .createToken(
              type,
              useClass<ElementRendererHtml>(() => [refStoreToken.resolve()]),
            )
            .provide(ElementRendererHtml);
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
          container
            .createToken(type, useClass<TextRendererHtml>())
            .provide(TextRendererHtml);

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
          container
            .createToken(type, useClass<ListRendererHtml>())
            .provide(ListRendererHtml);

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
          const hookHandlerToken = container.createToken(
            'IHookHandler',
            useClass<IHookHandler>(() => [refStoreToken.resolve()]),
            multiple(),
          );
          hookHandlerToken.provide(ElementReferenceHookHandler);
          hookHandlerToken.provide(PickTemplateHookHandler);
          hookHandlerToken.provide(LifecycleHookHandler);
          hookHandlerToken.provide(TransformHookHandler);
          container
            .createToken(
              type,
              useClass<CustomRendererHtml>(() => [
                refStoreToken.resolve(),
                hookHandlerToken.resolve(),
              ]),
            )
            .provide(CustomRendererHtml);

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
          container
            .createToken(type, useClass<ConditionalRendererHtml>())
            .provide(ConditionalRendererHtml);

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
          container
            .createToken(
              'RefStoreMemo',
              useClass<RefStoreMemo>(() => [refStoreToken.resolve()]),
            )
            .provide(RefStoreMemo);
          container
            .createToken(
              type,
              useClass<DynamicRendererHtml>((c) => [c.resolve('RefStoreMemo')]),
            )
            .provide(DynamicRendererHtml);

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

