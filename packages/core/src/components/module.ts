import { TemplateParser, templateParser } from '@core/parsers/html';
import { DocumentRef } from '@core/render/html/documentRef/document-ref';
import {
  container,
  singleton,
  useClass,
  useFunction,
  useValue,
} from '@rexar/di';
import { IDocumentRef } from '@core/render/html/documentRef/@types/IDocumentRef';
import { resolveNodes } from '@core/parsers/html/node-resolver/resolve-nodes';
import { ComponentDefinitionBuilder } from './component-definition-builder';

export const nodeResolverToken = container.createToken(
  'NodeResolver',
  useFunction<NodeListOf<ChildNode>, [string]>(),
  singleton(),
);

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
  nodeResolverToken.provide(resolveNodes);
}
