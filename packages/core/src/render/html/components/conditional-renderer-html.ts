import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { dynamic } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@core/reactivity/ref';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { skipUntil } from 'rxjs/internal/operators/skipUntil';
import { injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { resolveRenderer } from '../tools';

@injectable()
export class ConditionalRendererHtml extends HtmlRendererBase<IConditionalComponentProps> {
  innerDynamic = dynamic();

  innerDynamicRenderer = resolveRenderer(this.innerDynamic);

  condition$ = ref$(this.component$.pipe(map((c) => c?.getProp('if$'))));

  positiveComponent$ = ref$(
    this.component$.pipe(switchMap((c) => c?.getProp('ifTrue$'))),
  );

  negativeComponent$ = ref$(
    this.component$.pipe(switchMap((c) => c?.getProp('ifFalse$'))),
  );

  constructor() {
    super();
    this.target$
      .pipe(filter((t): t is IBinding => t != null))
      .subscribe((t) => {
        this.innerDynamicRenderer.target$.val = t;
      });
  }

  renderInto(): Observable<IBinding | undefined> {
    const condition$ = this.component.getProp('if$');

    if (condition$.val) {
      if (this.positiveComponent$.val) {
        this.innerDynamic.bindProp('component$', this.positiveComponent$.val);
      }
    } else if (this.negativeComponent$.val) {
      this.innerDynamic.bindProp('component$', this.negativeComponent$.val);
    }

    const renderAsync = async () => {
      await this.innerDynamicRenderer.render();
      return this.innerDynamicRenderer.nextTarget$;
    };

    const firstMount$ = from(renderAsync()).pipe(
      switchMap((v) => (v == null ? of(undefined) : v)),
      take(1),
    );

    condition$
      .pipe(
        skipUntil(firstMount$),
        switchMap((c) =>
          c ? this.positiveComponent$ : this.negativeComponent$,
        ),
      )
      .subscribe(async (component) => {
        this.innerDynamic.bindProp('component$', component);
      });

    return firstMount$;
  }

  async unmount(): Promise<void> {
    this.innerDynamicRenderer.unmount();
  }
}
