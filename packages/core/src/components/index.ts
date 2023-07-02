import { TemplateParser, templateParser } from '@core/parsers/html';
import { DocumentRef } from '@core/render/html/documentRef';
import { container, singleton, useClass, useValue } from '@rexar/di';
import { IComponentDefinitionBuilder } from './@types/IComponentDefinitionBuilder';
import { ICustomTemplateComponentDefinitionArgs } from './builtIn/custom/custom-template.component';
import { IComponentDefinitionArgs, TData } from './component';
import {
  ComponentDefinition,
  ComponentDefinitionBuilder,
} from './component-definition-builder';

container
  .createToken('DocumentRef', useClass<DocumentRef>(), singleton())
  .provide(DocumentRef);

container
  .createToken('TemplateParser', useValue<TemplateParser>())
  .provide(templateParser);

// container.register<TemplateParser>('TemplateParser', {
//   useValue: templateParser,
// });

container
  .createToken(
    'IComponentDefinitionBuilder',
    useClass<ComponentDefinitionBuilder>(),
    singleton(),
  )
  .provide(ComponentDefinitionBuilder);

// container.register<IComponentDefinitionBuilder>(
//   'IComponentDefinitionBuilder',
//   ComponentDefinitionBuilder,
// );

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

