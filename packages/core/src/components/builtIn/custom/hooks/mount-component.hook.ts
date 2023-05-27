import { AnyComponentDefinition, ComponentDefinition } from '@core/components';
import { TData } from '@core/components/component';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface IMountComponentHookParams {
  id: string;
  componentOrDefinition: AnyComponentDefinition;
}

const mountComponentHook = defineHook<AnyComponent, IMountComponentHookParams>(
  BuiltInHooks.MountComponent,
);

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
