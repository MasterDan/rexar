import { MaybeObservable } from '@core/@types/MaybeObservable';
import { AnyComponentDefinition, ComponentDefinition } from '@core/components';
import { TData } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { filter, Observable } from 'rxjs';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface IMountComponentHookParams {
  id: string;
  definition: Observable<AnyComponentDefinition>;
}

const mountComponentHook = defineHook<AnyComponent, IMountComponentHookParams>(
  BuiltInHooks.MountComponent,
);

export function mountComponent<TProps extends TData>(
  id: string,
  componentOrDefinition: MaybeObservable<
    ComponentDefinition<TProps> | undefined
  >,
  props?: TProps,
) {
  mountComponentHook(
    (component) => {
      if (props) {
        component.bindProps(props);
      }
    },
    {
      id,
      definition: ref$(componentOrDefinition).pipe(
        filter((x): x is ComponentDefinition<TProps> => x != null),
      ),
    },
  );
}
