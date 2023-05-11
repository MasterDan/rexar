import {
  CustomTemplateComponent,
  ICustomTemplateComponentDefinitionArgs,
} from './builtIn/custom/custom-template-component';
import { Component, IComponentDefinitionArgs, TData } from './component';

export type ComponentDefinition<TProps extends TData = TData> = {
  create: () => Component<TProps>;
  name?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponentDefinition = ComponentDefinition<any>;

function shouldWeCreateCustomComponent<TProps extends TData>(
  args: IComponentDefinitionArgs<TProps>,
): args is ICustomTemplateComponentDefinitionArgs<TProps> {
  return (
    (args as ICustomTemplateComponentDefinitionArgs<TProps>).template != null
  );
}

function checkProps<TProps extends TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>
    | Omit<IComponentDefinitionArgs<TProps>, 'props'>
    | Omit<ICustomTemplateComponentDefinitionArgs<TProps>, 'props'>,
): args is
  | IComponentDefinitionArgs<TProps>
  | ICustomTemplateComponentDefinitionArgs<TProps> {
  return (args as Record<string, unknown>).props != null;
}

function defineComponentWithoutProps(
  args:
    | Omit<IComponentDefinitionArgs<TData>, 'props'>
    | Omit<ICustomTemplateComponentDefinitionArgs<TData>, 'props'>,
): ComponentDefinition<TData> {
  const creationArgs = { ...args, props: () => ({}) };
  const create = shouldWeCreateCustomComponent(creationArgs)
    ? () => new CustomTemplateComponent<TData>(creationArgs)
    : () => new Component<TData>(creationArgs);
  return { create, name: args.name };
}

function defineComponentWithProps<TProps extends TData = TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>,
): ComponentDefinition<TProps> {
  const create = shouldWeCreateCustomComponent(args)
    ? () => new CustomTemplateComponent<TProps>(args)
    : () => new Component<TProps>(args);
  return { create, name: args.name };
}

export function defineComponent(
  args:
    | Omit<IComponentDefinitionArgs<TData>, 'props'>
    | Omit<ICustomTemplateComponentDefinitionArgs<TData>, 'props'>,
): ComponentDefinition<TData>;
export function defineComponent<TProps extends TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>,
): ComponentDefinition<TProps>;
export function defineComponent<TProps extends TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>
    | Omit<IComponentDefinitionArgs<TData>, 'props'>
    | Omit<ICustomTemplateComponentDefinitionArgs<TData>, 'props'>,
): ComponentDefinition<TProps> | ComponentDefinition<TData> {
  return checkProps<TProps>(args)
    ? defineComponentWithProps<TProps>(args)
    : defineComponentWithoutProps(args);
}
