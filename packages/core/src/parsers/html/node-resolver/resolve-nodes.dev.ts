// eslint-disable-next-line import/no-extraneous-dependencies
import { JSDOM } from 'jsdom';

export function resolveNodes(html: string): NodeListOf<ChildNode> {
  const jd = new JSDOM(html);
  return jd.window.document.body.childNodes;
}
