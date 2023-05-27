import { AnyComponentDefinition, ComponentDefinition } from '@core/components';
import { TData } from '@core/components/component';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { defineHook } from '@core/tools/hooks/hooks';
import { AnyComponent } from 'packages/core/dist/types';
import { BuiltInHooks } from './@types/built-in-hooks';

interface IDefinitionWithProps<TProps extends TData = TData> {
  definition: ComponentDefinition<TProps>;
  props?: TProps;
}

export interface IConditionalHookParams {
  if$: MayBeReadonlyRef<boolean>;
  positive: AnyComponentDefinition;
  negative?: AnyComponentDefinition;
}

export const conditionalHook = defineHook<{
  component?: AnyComponent;
  condition: boolean;
}>(BuiltInHooks.Conditional);

export function ifElse(
  if$: MayBeReadonlyRef<boolean>,
  positive: IDefinitionWithProps,
  negative?: IDefinitionWithProps,
) {
  conditionalHook(
    ({ component, condition }) => {
      if (component == null) {
        return;
      }
      component.bindProps(condition ? positive.props : negative?.props);
    },
    {
      if$,
      positive: positive.definition,
      negative: negative?.definition,
    },
  );
}
