import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';

@injectable()
export class ConditionalRendererHtml extends HtmlRendererBase<IConditionalComponentProps> {
  // eslint-disable-next-line class-methods-use-this
  renderInto(target: IBinding): Observable<IBinding | undefined> {
    const condition = this.component.getProp('if$');
    const positiveComponent = this.component.getProp('ifTrue$');
    const negativeComponent = this.component.getProp('ifFalse$');

    const mount$ = condition.pipe(
      switchMap((c) => (c ? positiveComponent : negativeComponent)),
      map((c) => {
        if (c == null) {
          return undefined;
        }
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(c);
        renderer.target$.val = target;
        return renderer;
      }),
      switchMap((r) => {
        if (r == null) {
          return of(undefined);
        }
        const renderAsync = async () => {
          await r.render();
          return r.nextTarget$;
        };
        return from(renderAsync());
      }),
      switchMap((v) => (v == null ? of(undefined) : v)),
      take(1),
    );
    return mount$;
  }

  // eslint-disable-next-line class-methods-use-this
  unmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
