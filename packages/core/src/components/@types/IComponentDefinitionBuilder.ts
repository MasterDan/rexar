import type { ICustomTemplateComponentDefinitionArgs } from '../builtIn/custom/custom-template.component';
import type { IComponentDefinitionArgs, TData } from '../component';
import type { ComponentDefinition } from '../component-definition-builder';

export interface IComponentDefinitionBuilder {
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
}
