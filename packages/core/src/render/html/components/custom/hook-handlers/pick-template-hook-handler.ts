import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IPickTemplateHookArgs } from '@core/components/builtIn/custom/hooks/pick-template.hook';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { Observable } from 'rxjs';
import { injectable } from 'tsyringe';
import { HookHandler, IHookPayload } from './base/hook-handler';

@injectable()
export class PickTemplateHookHandler extends HookHandler<
  AnyComponent[],
  IPickTemplateHookArgs
> {
  hookName = BuiltInHooks.PickTemplate;

  handle(
    payload$: Observable<IHookPayload<AnyComponent[], IPickTemplateHookArgs>>,
  ): void {
    payload$.subscribe(({ params, trigger$ }) => {
      const template = this.refStore.getTemplate(params.id);
      trigger$.next(template);
    });
  }
}
