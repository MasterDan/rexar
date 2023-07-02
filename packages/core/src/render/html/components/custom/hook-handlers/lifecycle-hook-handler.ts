import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { ComponentLifecycle } from '@core/render/html/base/lifecycle';
import { distinct, Observable } from 'rxjs';
import { HookHandler, IHookPayload } from './base/hook-handler';

export class LifecycleHookHandler extends HookHandler<
  Observable<ComponentLifecycle>,
  unknown
> {
  hookName = BuiltInHooks.Lisecycle;

  handle(
    payload$: Observable<IHookPayload<Observable<ComponentLifecycle>, unknown>>,
  ): void {
    payload$.subscribe(({ trigger$ }) => {
      const lf = this.refStore.getLifecycle().pipe(distinct());
      trigger$.next(lf);
    });
  }
}
