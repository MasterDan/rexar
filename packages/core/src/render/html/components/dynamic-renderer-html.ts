import { IDynamicComponentProps } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@core/reactivity/ref';
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
import { injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { ComponentLifecycle } from '../base/lifecycle';
import { RefStoreMemo } from '../ref-store/ref-store-memo';
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

  constructor(private refStoreMemo: RefStoreMemo) {
    super();
  }

  renderInto(): Observable<IBinding | undefined> {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    this.refStoreMemo.rememberScope();

    const renderAsync = async () => {
      if (this.renderer$.value == null) {
        return undefined;
      }
      this.refStoreMemo.rememberScope();
      await this.renderer$.value.render();
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      this.refStoreMemo.forgetScope();
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
          this.refStoreMemo.rememberScope();
          await current.render();
          this.refStoreMemo.forgetScope();
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

