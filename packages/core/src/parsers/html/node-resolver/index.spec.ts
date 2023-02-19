import { resolveNodes } from '.';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const testHtml = require('./test.html');

describe('html initial parser', () => {
  test('test-page', async () => {
    const nodes = await resolveNodes(testHtml);
    const nodeArr = Array.from(nodes).filter((n) => n.nodeType === 1);
    expect(nodeArr.length).toBe(4);
  });
});
