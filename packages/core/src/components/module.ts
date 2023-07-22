import { TemplateParser, templateParser } from '@core/parsers/html';
import { DocumentRef } from '@core/render/html/documentRef';
import { container, singleton, useClass, useValue } from '@rexar/di';
import { ComponentDefinitionBuilder } from './component-definition-builder';

export const documentRefToken = container.createToken(
  'DocumentRef',
  useClass<DocumentRef>(),
  singleton(),
);

export const templateParserToken = container.createToken(
  'TemplateParser',
  useValue<TemplateParser>(),
);

export const componentDefinitionBuilderToken = container.createToken(
  'IComponentDefinitionBuilder',
  useClass<ComponentDefinitionBuilder>(),
  singleton(),
);

export function setup() {
  documentRefToken.provide(DocumentRef);
  templateParserToken.provide(templateParser);
  componentDefinitionBuilderToken.provide(ComponentDefinitionBuilder);
}
