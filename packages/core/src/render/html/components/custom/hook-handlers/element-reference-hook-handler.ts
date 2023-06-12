import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IElementReferenceHoolParams } from '@core/components/builtIn/custom/hooks/element-reference.hook';
import { ref$ } from '@core/reactivity/ref';
import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import {
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  pairwise,
} from 'rxjs';
import { injectable } from 'tsyringe';
import { HookHandler, IHookPayload } from './base/hook-handler';

@injectable()
export class ElementReferenceHookHandler extends HookHandler<
  HTMLElement | undefined,
  IElementReferenceHoolParams
> {
  hookName = BuiltInHooks.ElementReference;

  handle(
    payload$: Observable<
      IHookPayload<HTMLElement | undefined, IElementReferenceHoolParams>
    >,
  ): void {
    const beforeUnmount$ = ref$(
      this.refStore.getLifecycle().pipe(
        pairwise(),
        map(
          ([prev, curr]) =>
            prev === ComponentLifecycle.Mounted &&
            curr === ComponentLifecycle.BeforeUnmount,
        ),
      ),
      false,
    );
    payload$
      .pipe(
        mergeMap(({ params: { id }, trigger$ }) => {
          const { reference } = this.refStore.getReferences(id);
          return combineLatest([reference.el, beforeUnmount$]).pipe(
            filter((arr): arr is [HTMLElement, boolean] => arr[0] != null),
            map(([el, beforeUnmount]) => ({
              el: beforeUnmount ? undefined : el,
              trigger$,
            })),
          );
        }),
      )
      .subscribe(({ el, trigger$ }) => {
        trigger$.next(el);
      });
  }
}
