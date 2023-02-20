import { isBrowser } from '@core/tools/env';

export async function resolveNodes(html: string) {
  if (isBrowser()) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(html, 'text/html');
    return htmlDoc.body.childNodes;
  }
  const { JSDOM } = await import('jsdom');
  const jd = new JSDOM(html);
  return jd.window.document.body.childNodes;
}
