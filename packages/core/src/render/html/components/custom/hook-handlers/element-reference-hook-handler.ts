import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IElementReferenceHoolParams } from '@core/components/builtIn/custom/hooks/use-element.hook';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { injectable } from 'tsyringe';
import { HookHandler, IHookPayload } from './base/hook-handler';

@injectable()
export class ElementReferenceHookHandler extends HookHandler<
  HTMLElement,
  IElementReferenceHoolParams
> {
  hookName = BuiltInHooks.ElementReference;

  handle(
    payload$: Observable<
      IHookPayload<HTMLElement, IElementReferenceHoolParams>
    >,
  ): void {
    payload$
      .pipe(
        mergeMap(({ params: { id }, trigger$ }) => {
          const { reference } = this.refStore.getReferences(id);
          return reference.el.pipe(
            filter((x): x is HTMLElement => x != null),
            map((el) => ({ el, trigger$ })),
          );
        }),
      )
      .subscribe(({ el, trigger$ }) => {
        trigger$.next(el);
      });
  }
}
