import { BuiltInHooks } from '@core/components/builtIn/custom/hooks/@types/built-in-hooks';
import { IMountComponentHookParams } from '@core/components/builtIn/custom/hooks/mount-component.hook';
import { ComponentType } from '@core/components/component-type';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { map, mergeMap, Observable } from 'rxjs';
import { injectable } from 'tsyringe';
import { HookHandler, IHookPayload } from './base/hook-handler';

@injectable()
export class MountComponentHookHandler extends HookHandler<
  AnyComponent,
  IMountComponentHookParams
> {
  hookName = BuiltInHooks.MountComponent;

  handle(
    payload$: Observable<IHookPayload<AnyComponent, IMountComponentHookParams>>,
  ): void {
    payload$
      .pipe(
        mergeMap(({ params, trigger$ }) =>
          params.definition.pipe(
            map((definition) => ({
              definition,
              id: params.id,
              trigger$,
            })),
          ),
        ),
      )
      .subscribe(({ definition, id, trigger$ }) => {
        const { transformer } = this.refStore.getReferences(id);
        transformer.append((c) => {
          if (c.type !== ComponentType.HTMLElement) {
            return c;
          }
          const newComponent = definition.create();
          trigger$.next(newComponent);
          if (c.getProp('name') !== 'SLOT') {
            c.bindProp('children', [newComponent]);
            c.preventTransformation = true;
            return c;
          }
          return newComponent;
        });
      });
  }
}
