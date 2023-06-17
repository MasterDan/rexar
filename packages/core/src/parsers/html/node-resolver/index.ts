export async function resolveNodes(html: string) {
  if (process.env.NODE_ENV === 'test') {
    const { JSDOM } = await import('jsdom');
    const jd = new JSDOM(html);
    return jd.window.document.body.childNodes;
  }
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');
  return htmlDoc.body.childNodes;
}
