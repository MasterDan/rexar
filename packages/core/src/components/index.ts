import { TemplateParser, templateParser } from '@core/parsers/html';
import { container } from 'tsyringe';
import { IComponentDefinitionBuilder } from './@types/IComponentDefinitionBuilder';
import { ICustomTemplateComponentDefinitionArgs } from './builtIn/custom/custom-template.component';
import { IComponentDefinitionArgs, TData } from './component';
import {
  ComponentDefinition,
  ComponentDefinitionBuilder,
} from './component-definition-builder';

container.register<TemplateParser>('TemplateParser', {
  useValue: templateParser,
});

container.register<IComponentDefinitionBuilder>(
  'IComponentDefinitionBuilder',
  ComponentDefinitionBuilder,
);

const builder = container.resolve<IComponentDefinitionBuilder>(
  'IComponentDefinitionBuilder',
);

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return builder.defineComponent(args as any);
}

