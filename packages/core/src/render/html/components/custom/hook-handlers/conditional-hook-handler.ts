import { conditional } from '@core/components/builtIn/conditional.component';
import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import {
  IConditionalHookArgs,
  IConditionalHookParams,
} from '@core/components/builtIn/custom/hooks/if-else.hook';
import { ComponentType } from '@core/components/component-type';
import { ref$ } from '@core/reactivity/ref';
import { Observable } from 'rxjs';
import { injectable } from 'tsyringe';
import { HookHandler, IHookPayload } from './base/hook-handler';

@injectable()
export class ConditionalHookHandler extends HookHandler<
  IConditionalHookArgs,
  IConditionalHookParams
> {
  hookName = BuiltInHooks.Conditional;

  handle(
    payload$: Observable<
      IHookPayload<IConditionalHookArgs, IConditionalHookParams>
    >,
  ): void {
    payload$.subscribe(({ params, trigger$ }) => {
      const { transformer } = this.refStore.getReferences(params.id);
      transformer.append((c) => {
        if (c.type !== ComponentType.HTMLElement) {
          return c;
        }
        const positiveComponent = params.positive.create();
        const negativeComponent = params.negative?.create();
        trigger$.next({
          component: positiveComponent,
          condition: true,
        });
        if (negativeComponent) {
          trigger$.next({
            component: negativeComponent,
            condition: false,
          });
        }
        const newComponent = conditional(
          params.if$,
          ref$(positiveComponent),
          negativeComponent ? ref$(negativeComponent) : undefined,
        );
        if (c.getProp('name') !== 'SLOT') {
          c.bindProp('children', [newComponent]);
          return c;
        }
        return newComponent;
      });
    });
  }
}
