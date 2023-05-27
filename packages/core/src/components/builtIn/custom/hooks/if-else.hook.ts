import { AnyComponentDefinition, ComponentDefinition } from '@core/components';
import { TData } from '@core/components/component';
import { MayBeReadonlyRef } from '@core/reactivity/ref/@types/MayBeReadonlyRef';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';

interface IDefinitionWithProps<TProps extends TData = TData> {
  definition: ComponentDefinition<TProps>;
  props?: TProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDefinitionWithProps = IDefinitionWithProps<any>;

export interface IConditionalHookParams {
  id: string;
  if$: MayBeReadonlyRef<boolean>;
  positive: AnyComponentDefinition;
  negative?: AnyComponentDefinition;
}

export interface IConditionalHookArgs {
  component?: AnyComponent;
  condition: boolean;
}

export const conditionalHook = defineHook<IConditionalHookArgs>(
  BuiltInHooks.Conditional,
);

export function ifElse(
  id: string,
  if$: MayBeReadonlyRef<boolean>,
  positive: AnyDefinitionWithProps,
  negative?: AnyDefinitionWithProps,
) {
  conditionalHook(
    ({ component, condition }) => {
      if (component == null) {
        return;
      }
      component.bindProps(condition ? positive.props : negative?.props);
    },
    {
      id,
      if$,
      positive: positive.definition,
      negative: negative?.definition,
    },
  );
}
