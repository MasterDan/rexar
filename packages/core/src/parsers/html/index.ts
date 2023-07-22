import { el } from '@core/components/builtIn/element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@rexar/reactivity';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { isValidString } from '@core/tools/string';
import { container } from '@rexar/di';
import { IDocumentRef } from '@core/render/html/documentRef/@types/IDocumentRef';
import { extractId } from './id-checker';
import { resolveNodes } from './node-resolver';
import { isHtmlElement, isTextNode } from './node-types';
import { HtmlElementNames } from './tags/html-names';

export type Templates = {
  default: AnyComponent[];
  inner: Record<string, AnyComponent[]>;
};

function trimTextNode(node: ChildNode) {
  if (node.nodeValue == null) {
    return '';
  }
  let startIndex = 0;
  let stopIndex = node.nodeValue.length;
  for (let i = 0; i < node.nodeValue.length; i += 1) {
    const code = node.nodeValue.charCodeAt(i);
    if (code === 10 || code === 32) {
      startIndex += 1;
    } else {
      break;
    }
  }

  for (let i = node.nodeValue.length - 1; i >= 0; i -= 1) {
    const code = node.nodeValue.charCodeAt(i);
    if (code === 10 || code === 32) {
      stopIndex -= 1;
    } else {
      break;
    }
  }
  return node.nodeValue.substring(startIndex, stopIndex);
}

function parseNodes(
  nodes: NodeListOf<ChildNode>,
  templates: Templates,
): AnyComponent[] {
  const nodesArray = Array.from(nodes);
  const parsed = nodesArray
    .map((node): AnyComponent | null => {
      if (isTextNode(node)) {
        return isValidString(node.nodeValue)
          ? (text({ value: ref$(trimTextNode(node)) }) as AnyComponent)
          : null;
      }
      if (isHtmlElement(node)) {
        const ittributesNotEmpty = node.attributes.length > 0;
        const attributes: Record<string, string | null> | undefined =
          ittributesNotEmpty ? {} : undefined;
        let id: string | undefined;
        if (ittributesNotEmpty) {
          // eslint-disable-next-line no-restricted-syntax
          for (const attr of node.attributes) {
            const mayBeId = extractId(attr.name);
            if (mayBeId != null) {
              id = mayBeId;
            } else {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              attributes![attr.name] = attr.nodeValue;
            }
          }
        }

        if (node.nodeName === HtmlElementNames.Template && id != null) {
          const templateChildNodes = (node as HTMLTemplateElement).content
            .childNodes;
          const templateContent =
            templateChildNodes.length > 0
              ? parseNodes(templateChildNodes, templates)
              : [];
          templates.inner[id] = templateContent;
          return null;
        }
        const children =
          node.childNodes.length > 0
            ? parseNodes(node.childNodes, templates)
            : undefined;
        return el(
          {
            name: node.nodeName,
            attrs: attributes,
            children,
          },
          id,
        ) as AnyComponent;
      }
      return null;
    })
    .filter((x): x is AnyComponent => x != null);
  return parsed;
}

function fromComponents(components: AnyComponent[]) {
  const templates: Templates = { default: components, inner: {} };
  return Promise.resolve(templates);
}

async function fromString(html: string): Promise<Templates> {
  const nodes = await resolveNodes(html);
  const templates: Templates = { default: [], inner: {} };
  templates.default = parseNodes(nodes, templates);
  return templates;
}

async function fromQuerySelector(selector: string) {
  const doc = container.resolve<IDocumentRef>('IDocumentRef').document;
  const templates: Templates = { default: [], inner: {} };
  const element = doc.querySelector(selector);
  if (element == null || element.nodeName !== HtmlElementNames.Template) {
    return templates;
  }
  const nodes = (element as HTMLTemplateElement).content.childNodes;
  templates.default = parseNodes(nodes, templates);
  return templates;
}

async function fromModule(
  fn: () => Promise<Record<string, string> | string | (string | undefined)[]>,
) {
  const module = await fn();
  if (typeof module === 'string') {
    return fromString(module);
  }
  if (Array.isArray(module)) {
    const template = module.find((x) => typeof x === 'string');
    if (template == null) {
      throw new Error('Cannot parse module');
    }
    return fromString(template);
  }
  if (module.default == null) {
    throw new Error('Cannot parse module');
  }
  return fromString(module.default);
}

const templateParser = {
  fromComponents,
  fromString,
  fromQuerySelector,
  fromModule,
};

export type TemplateParser = typeof templateParser;

export { templateParser };
