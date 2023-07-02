import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IPickTemplateHookArgs } from '@core/components/builtIn/custom/hooks/pick-template.hook';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { HookHandler, IHookPayload } from './base/hook-handler';

export class PickTemplateHookHandler extends HookHandler<
  AnyComponent[],
  IPickTemplateHookArgs
> {
  hookName = BuiltInHooks.PickTemplate;

  handle(
    payload$: Observable<IHookPayload<AnyComponent[], IPickTemplateHookArgs>>,
  ): void {
    payload$
      .pipe(
        mergeMap(({ params, trigger$ }) =>
          this.refStore
            .getTemplate(params.id)
            .pipe(map((template) => ({ template, trigger$ }))),
        ),
        filter(({ template }) => template.length > 0),
      )
      .subscribe(({ template, trigger$ }) => {
        trigger$.next(template);
      });
  }
}
