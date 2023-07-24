export function resolveNodes(html: string): NodeListOf<ChildNode> {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');
  return htmlDoc.body.childNodes;
}
