import {
  CustomComponent,
  ICustomComponentDefinitionArgs,
} from './builtIn/custom/custom-template-component';
import { Component, IComponentDefinitionArgs, TData } from './component';

export type ComponentDefinition<TProps extends TData = TData> = {
  create: () => Component<TProps>;
  name?: string;
};

function shouldWeCreateCustomComponent<TProps extends TData>(
  args: IComponentDefinitionArgs<TProps>,
): args is ICustomComponentDefinitionArgs<TProps> {
  return (args as ICustomComponentDefinitionArgs<TProps>).template != null;
}

export function defineComponent<TProps extends TData = TData>(
  args: IComponentDefinitionArgs<TProps> = {},
): ComponentDefinition<TProps> {
  const create = shouldWeCreateCustomComponent(args)
    ? () => new CustomComponent<TProps>(args)
    : () => new Component<TProps>(args);
  return { create, name: args.name };
}
