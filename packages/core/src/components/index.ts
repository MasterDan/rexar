import { ICustomTemplateComponentDefinitionArgs } from './builtIn/custom/custom-template.component';
import { IComponentDefinitionArgs, TData } from './component';
import { ComponentDefinition } from './component-definition-builder';
import { componentDefinitionBuilderToken, setup } from './module';

setup();

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
  const builder = componentDefinitionBuilderToken.resolve();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.defineComponent(args as any);
}

