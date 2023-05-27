import { AnyComponentDefinition, ComponentDefinition } from '@core/components';
import { TData } from '@core/components/component';
import { defineHook } from '@core/tools/hooks/hooks';
import { AnyComponent } from 'packages/core/dist/types';
import { BuiltInHooks } from './@types/built-in-hooks';

const mountComponentHook = defineHook<AnyComponent>(
  BuiltInHooks.MountComponent,
);

export interface IMountComponentHookParams {
  id: string;
  componentOrDefinition: AnyComponentDefinition;
}

export function mountComponent<TProps extends TData>(
  id: string,
  componentOrDefinition: ComponentDefinition<TProps>,
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
      componentOrDefinition,
    },
  );
}
