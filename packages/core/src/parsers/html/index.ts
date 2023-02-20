import { el } from '@core/components/builtIn/html-element.component';
import { text } from '@core/components/builtIn/text.component';
import { ref$ } from '@core/reactivity/ref';
import { AnyComponent } from 'packages/core/dist/types';
import { resolveNodes } from './node-resolver';
import { isHtmlElement, isTextNode } from './node-types';

function parseNodes(nodes: NodeListOf<ChildNode>): (AnyComponent | null)[] {
  const nodesArray = Array.from(nodes);
  return nodesArray.map((node): AnyComponent | null => {
    if (isTextNode(node)) {
      return node.nodeValue
        ? (text({ value: ref$(node.nodeValue) }) as AnyComponent)
        : null;
    }
    if (isHtmlElement(node)) {
      const ittributesNotEmpty = node.attributes.length > 0;
      const attributes: Record<string, string | null> | undefined =
        ittributesNotEmpty ? {} : undefined;
      if (ittributesNotEmpty) {
        // eslint-disable-next-line no-restricted-syntax
        for (const attr of node.attributes) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          attributes![attr.name] = attr.nodeValue;
        }
      }
      const children =
        node.childNodes.length > 0
          ? parseNodes(node.childNodes).filter(
              (x): x is AnyComponent => x != null,
            )
          : undefined;
      return el({
        name: node.nodeName,
        attrs: attributes,
        children,
      }) as AnyComponent;
    }
    return null;
  });
}

export async function parseHtml(html: string): Promise<AnyComponent[]> {
  const nodes = await resolveNodes(html);
  return parseNodes(nodes).filter((c): c is AnyComponent => c != null);
}
