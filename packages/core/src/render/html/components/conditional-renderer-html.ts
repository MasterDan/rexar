import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { ref$ } from '@core/reactivity/ref';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { container, injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { HtmlRendererBase } from '../base/html-renderer-base';

@injectable()
export class ConditionalRendererHtml extends HtmlRendererBase<IConditionalComponentProps> {
  positiveRenderer$ = ref$(
    combineLatest([
      this.component$.pipe(map((c) => c?.getProp('ifTrue$'))),
      this.target$,
    ]).pipe(
      map(([c, t]) => {
        if (c == null || c.val == null || t == null) {
          return undefined;
        }
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(c.val);
        renderer.target$.val = t;
        return renderer;
      }),
    ),
  );

  negativeRenderer$ = ref$(
    combineLatest([
      this.component$.pipe(map((c) => c?.getProp('ifFalse$'))),
      this.target$,
    ]).pipe(
      map(([c, t]) => {
        if (c == null || c.val == null || t == null) {
          return undefined;
        }
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(c.val);
        renderer.target$.val = t;
        return renderer;
      }),
    ),
  );

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    const condition = this.component.getProp('if$');
    const positiveComponent = this.component.getProp('ifTrue$');
    const negativeComponent = this.component.getProp('ifFalse$');

    const firstMount$ = condition.pipe(
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firstRenderCompleted$ = firstMount$.pipe(map(() => true));

    return firstMount$;
  }

  // eslint-disable-next-line class-methods-use-this
  unmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
