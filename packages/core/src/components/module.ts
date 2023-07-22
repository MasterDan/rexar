import { TemplateParser, templateParser } from '@core/parsers/html';
import { DocumentRef } from '@core/render/html/documentRef/document-ref';
import { container, singleton, useClass, useValue } from '@rexar/di';
import { IDocumentRef } from '@core/render/html/documentRef/@types/IDocumentRef';
import { ComponentDefinitionBuilder } from './component-definition-builder';

export const documentRefToken = container.createToken(
  'IDocumentRef',
  useClass<IDocumentRef>(),
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
