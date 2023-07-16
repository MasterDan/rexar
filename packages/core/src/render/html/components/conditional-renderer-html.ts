import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { dynamic } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@rexar/reactivity';
import { ScopedLogger } from '@rexar/logger';
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
  private $logger: ScopedLogger | undefined;

  private get logger() {
    if (this.$logger == null) {
      throw new Error('Logger for custom component not been set');
    }
    return this.$logger;
  }

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
    this.$logger = ScopedLogger.createScope.child('If-else', {
      captureNext: true,
    });
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
      ScopedLogger.endScope();
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
          (c ? this.positiveComponent$ : this.negativeComponent$).pipe(
            map((component) => ({ component, condition: c })),
          ),
        ),
      )
      .subscribe(async ({ component, condition }) => {
        this.logger.debug(`Condition is ${condition}`);
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
