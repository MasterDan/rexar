import {
  IListComponentProps,
  listComponentName,
} from '@core/components/builtIn/list.component';
import { Component } from '@core/components/component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

@injectable()
export class ListRendererHtml extends HtmlRendererBase {
  async unmount(): Promise<void> {
    const content = this.listComponent.getProp('content') ?? [];
    if (this.target$.val == null) {
      throw new Error('Target not exists');
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const component of content) {
      const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
      renderer.target$.val = this.target$.val;
      renderer.setComponent(component);
      // eslint-disable-next-line no-await-in-loop
      await renderer.unmount();
    }
  }

  get listComponent(): Component<IListComponentProps> {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('List must have name');
    }
    if (this.component.name !== listComponentName) {
      throw new Error('Component must render list of components');
    }
    return this.component;
  }

  renderInto(target: IBinding) {
    const content = this.listComponent.getProp('content') ?? [];
    const renderContent = async () => {
      let renderer: IHtmlRenderer | null = null;

      // eslint-disable-next-line no-restricted-syntax
      for (const component of content) {
        if (renderer == null) {
          renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
          renderer.target$.val = target;
          renderer.setComponent(component);
          // eslint-disable-next-line no-await-in-loop
          await renderer.render();
        } else {
          const newRenderer: IHtmlRenderer =
            container.resolve<IHtmlRenderer>('IHtmlRenderer');
          newRenderer.setComponent(component);
          newRenderer.target$.val = renderer.nextTarget$.val ?? target;
          renderer = newRenderer;
          // eslint-disable-next-line no-await-in-loop
          await newRenderer.render();
        }
      }

      return renderer?.nextTarget$.value ?? undefined;
    };
    return from(renderContent());
  }
}
