import { el } from '@core/components/builtIn/element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { isValidString } from '@core/tools/string';
import { extractId } from './id-checker';
import { resolveNodes } from './node-resolver';
import { isHtmlElement, isTextNode } from './node-types';
import { HtmlElementNames } from './tags/html-names';

export type Templates = {
  default: AnyComponent[];
  inner: Record<string, AnyComponent[]>;
};

function parseNodes(
  nodes: NodeListOf<ChildNode>,
  templates: Templates,
): AnyComponent[] {
  const nodesArray = Array.from(nodes);
  const parsed = nodesArray
    .map((node): AnyComponent | null => {
      if (isTextNode(node)) {
        return isValidString(node.nodeValue)
          ? (text({ value: ref$(node.nodeValue.trim()) }) as AnyComponent)
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

export async function parseHtml(html: string): Promise<Templates> {
  const nodes = await resolveNodes(html);
  const templates: Templates = { default: [], inner: {} };
  templates.default = parseNodes(nodes, templates);
  return templates;
}
