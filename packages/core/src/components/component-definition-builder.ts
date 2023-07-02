/* eslint-disable class-methods-use-this */
import type { IComponentDefinitionBuilder } from './@types/IComponentDefinitionBuilder';
import {
  CustomTemplateComponent,
  ICustomTemplateComponentDefinitionArgs,
} from './builtIn/custom/custom-template.component';
import { Component, IComponentDefinitionArgs, TData } from './component';
import { ComponentType } from './component-type';

export type ComponentDefinition<TProps extends TData = TData> = {
  create: () => Component<TProps>;
  type: ComponentType;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponentDefinition = ComponentDefinition<any>;

function shouldWeCreateCustomComponent<TProps extends TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>,
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
  return shouldWeCreateCustomComponent(creationArgs)
    ? {
        create: () => new CustomTemplateComponent<TData>(creationArgs),
        type: ComponentType.CustomTemplate,
      }
    : {
        create: () => new Component<TData>(creationArgs),
        type: creationArgs.type,
      };
}

function defineComponentWithProps<TProps extends TData = TData>(
  args:
    | IComponentDefinitionArgs<TProps>
    | ICustomTemplateComponentDefinitionArgs<TProps>,
): ComponentDefinition<TProps> {
  return shouldWeCreateCustomComponent(args)
    ? {
        create: () => new CustomTemplateComponent<TProps>(args),
        type: ComponentType.CustomTemplate,
      }
    : {
        create: () => new Component<TProps>(args),
        type: args.type,
      };
}

export class ComponentDefinitionBuilder implements IComponentDefinitionBuilder {
  defineComponent(
    args:
      | Omit<IComponentDefinitionArgs<TData>, 'props'>
      | Omit<ICustomTemplateComponentDefinitionArgs<TData>, 'props'>,
  ): ComponentDefinition<TData>;
  defineComponent<TProps extends TData>(
    args:
      | IComponentDefinitionArgs<TProps>
      | ICustomTemplateComponentDefinitionArgs<TProps>,
  ): ComponentDefinition<TProps>;
  defineComponent<TProps extends TData>(
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
}
