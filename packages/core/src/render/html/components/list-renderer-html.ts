import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { IBinding } from '../@types/binding-target';
import { render } from '../render';
import { ComponentRendererHtml } from '../component-renderer-html';

export class ListRendererHtml extends HtmlRendererBase {
  unbind$ = new Subject<void>();

  renderInto(target: IBinding) {
    const content = this.component.getProp('content') ?? [];
    const renderContent = async () => {
      this.unbind$.next();
      let renderer: ComponentRendererHtml | null = null;
      // eslint-disable-next-line no-restricted-syntax
      for (const component of content) {
        if (renderer == null) {
          // eslint-disable-next-line no-await-in-loop
          renderer = await render(component, target);
        } else {
          // eslint-disable-next-line no-await-in-loop
          const newRenderer: ComponentRendererHtml = await render(
            component,
            renderer.nextTarget$.val ?? target,
          );
          renderer.nextTarget$.pipe(takeUntil(this.unbind$)).subscribe((nt) => {
            newRenderer.target$.val = nt;
          });
          renderer = newRenderer;
        }
      }
      return renderer?.nextTarget$.value ?? undefined;
    };
    return from(renderContent());
  }
}
