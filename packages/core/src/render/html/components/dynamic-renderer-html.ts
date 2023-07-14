import { IDynamicComponentProps } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@rexar/reactivity';
import { ScopedLogger } from '@rexar/logger';
import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  of,
  pairwise,
  skipUntil,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { ComponentLifecycle } from '../base/lifecycle';
import { RefStoreMemo } from '../ref-store/ref-store-memo';
import { resolveRenderer } from '../tools';

export class DynamicRendererHtml extends HtmlRendererBase<IDynamicComponentProps> {
  private $logger: ScopedLogger | undefined;

  private get logger() {
    if (this.$logger == null) {
      throw new Error('Logger for custom component not been set');
    }
    return this.$logger;
  }

  renderer$ = ref$(
    combineLatest([
      this.component$.pipe(switchMap((c) => c.getProp('component$'))),
      this.target$,
    ]).pipe(
      map(([component, target]) =>
        component != null && target != null
          ? resolveRenderer(component, target)
          : undefined,
      ),
      tap((renderer) => {
        renderer?.subscribeParentLifecycle(this.lifecycle$);
      }),
    ),
  );

  constructor(private refStoreMemo: RefStoreMemo) {
    super();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    this.$logger = ScopedLogger.createScope.child('Dynamic', {
      captureNext: true,
    });
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    this.refStoreMemo.rememberScope();

    const renderAsync = async () => {
      if (this.renderer$.value == null) {
        this.lifecycle$.value = ComponentLifecycle.Rendered;
        return of(target);
      }
      this.refStoreMemo.rememberScope();
      await this.renderer$.value.render();
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      this.refStoreMemo.forgetScope();
      ScopedLogger.endScope();
      return this.renderer$.value.nextTarget$;
    };

    const firstMount$ = from(renderAsync()).pipe(
      switchMap((i) => i),
      take(1),
    );

    const beforeUnmount$ = this.lifecycle$.pipe(
      pairwise(),
      filter(
        ([prev, curr]) =>
          prev === ComponentLifecycle.Mounted &&
          curr === ComponentLifecycle.BeforeUnmount,
      ),
    );

    this.renderer$
      .pipe(pairwise(), skipUntil(firstMount$), takeUntil(beforeUnmount$))
      .subscribe(async ([previous, current]) => {
        this.logger.rememberMe({ captureNext: true });
        if (previous) {
          await previous.unmount();
        }
        if (current) {
          this.refStoreMemo.rememberScope();
          await current.render();
          this.refStoreMemo.forgetScope();
          this.nextTarget$.value = current.nextTarget$.value;
        } else {
          this.nextTarget$.value = this.target$.value;
        }
        ScopedLogger.endScope();
      });

    return firstMount$;
  }

  async unmount(): Promise<void> {
    if (this.renderer$.value) {
      this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
      await this.renderer$.value.unmount();
      this.lifecycle$.value = ComponentLifecycle.Unmounted;
    }
  }
}

