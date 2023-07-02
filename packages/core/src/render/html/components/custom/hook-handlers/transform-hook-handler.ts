import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { ITransformHookParams } from '@core/components/builtIn/custom/hooks/transform.hook';
import { ElementTransformer } from '@core/render/html/ref-store/element.transformer';
import { Observable } from 'rxjs';
import { HookHandler, IHookPayload } from './base/hook-handler';

export class TransformHookHandler extends HookHandler<
  ElementTransformer,
  ITransformHookParams
> {
  hookName = BuiltInHooks.Transform;

  handle(
    payload$: Observable<
      IHookPayload<ElementTransformer, ITransformHookParams>
    >,
  ): void {
    payload$.subscribe(({ params, trigger$ }) => {
      const { transformer } = this.refStore.getReferences(params.id);
      trigger$.next(transformer);
    });
  }
}
