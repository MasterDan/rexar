import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { dynamic } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@rexar/reactivity';
import {
  filter,
  from,
  map,
  Observable,
  of,
  skipUntil,
  switchMap,
  take,
} from 'rxjs';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { ComponentLifecycle } from '../base/lifecycle';
import { resolveRenderer } from '../tools';

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
        this.innerDynamicRenderer.target$.value = t;
      });
    this.innerDynamicRenderer.subscribeParentLifecycle(this.lifecycle$);
  }

  renderInto(): Observable<IBinding | undefined> {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    const condition$ = this.component.getProp('if$');

    if (condition$.value) {
      if (this.positiveComponent$.value) {
        this.innerDynamic.bindProp('component$', this.positiveComponent$.value);
      }
    } else if (this.negativeComponent$.value) {
      this.innerDynamic.bindProp('component$', this.negativeComponent$.value);
    }

    const renderAsync = async () => {
      await this.innerDynamicRenderer.render();
      this.lifecycle$.value = ComponentLifecycle.Rendered;
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
    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    await this.innerDynamicRenderer.unmount();
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
  }
}
