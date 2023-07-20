import { describe, test, expect } from 'vitest';
import { resolveNodes } from '.';
import testHtml from './test.html?raw';

describe('html initial parser', () => {
  test('test-page', async () => {
    const nodes = await resolveNodes(testHtml);
    const nodeArr = Array.from(nodes).filter((n) => n.nodeType === 1);
    expect(nodeArr.length).toBe(4);
  });
});
