import { TemplateParser, templateParser } from '@core/parsers/html';
import { container } from 'tsyringe';
import { IComponentDefinitionBuilder } from './@types/IComponentDefinitionBuilder';
import { ComponentDefinitionBuilder } from './component-definition-builder';

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

export const { defineComponent } = builder;

