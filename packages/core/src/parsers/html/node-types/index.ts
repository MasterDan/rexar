export function isHtmlElement(node: ChildNode): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE;
}

export function isTextNode(node: ChildNode) {
  return node.nodeName === '#text';
}
