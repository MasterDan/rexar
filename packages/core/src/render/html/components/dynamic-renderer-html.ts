import { IDynamicComponentProps } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@core/reactivity/ref';
import {
  combineLatest,
  from,
  map,
  Observable,
  of,
  pairwise,
  skipUntil,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { ComponentLifecycle } from '../base/lifecycle';
import { resolveRenderer } from '../tools';

@injectable()
export class DynamicRendererHtml extends HtmlRendererBase<IDynamicComponentProps> {
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

  renderInto(): Observable<IBinding | undefined> {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    const renderAsync = async () => {
      if (this.renderer$.value == null) {
        return undefined;
      }
      await this.renderer$.value.render();
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return this.renderer$.value.nextTarget$;
    };

    const firstMount$ = from(renderAsync()).pipe(
      switchMap((i) => (i == null ? of(i) : i)),
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
        if (previous) {
          await previous.unmount();
        }
        if (current) {
          await current.render();
          this.nextTarget$.value = current.nextTarget$.value;
        } else {
          this.nextTarget$.value = this.target$.value;
        }
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

