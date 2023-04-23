import { IListComponentProps } from '@core/components/builtIn/list.component';
import { Component } from '@core/components/component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

@injectable()
export class ListRendererHtml extends HtmlRendererBase {
  renderInto(target: IBinding) {
    const content =
      (this.component as Component<IListComponentProps>).getProp('content') ??
      [];
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
