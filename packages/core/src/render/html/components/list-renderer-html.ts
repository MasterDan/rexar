import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { container } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

export class ListRendererHtml extends HtmlRendererBase {
  unbind$ = new Subject<void>();

  renderInto(target: IBinding) {
    const content = this.component.getProp('content') ?? [];
    const renderContent = async () => {
      this.unbind$.next();
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
          renderer.nextTarget$.pipe(takeUntil(this.unbind$)).subscribe((nt) => {
            newRenderer.target$.val = nt ?? target;
          });
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
