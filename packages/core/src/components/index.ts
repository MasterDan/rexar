import { Component, IComponentDefinitionArgs, TData } from './conmponent';

export type ComponentDefinition<TProps extends TData = TData> = {
  create: () => Component<TProps>;
  name?: string;
};

export function defineComponent<TProps extends TData = TData>(
  args: IComponentDefinitionArgs<TProps>,
): ComponentDefinition<TProps> {
  const create = () => new Component<TProps>(args);
  return { create, name: args.name };
}
