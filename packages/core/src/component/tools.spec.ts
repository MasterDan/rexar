import { describe, expect, test, vi } from 'vitest';
import { useEvent } from './tools';

describe('tools', () => {
  test('use-event', () => {
    const [event$, emitEvent] = useEvent<string>();
    let checker: string | undefined;
    const subscription = vi.fn((val: string) => {
      checker = val;
    });
    event$.subscribe(subscription);
    emitEvent('test');
    expect(subscription).toBeCalled();
    expect(checker).toBe('test');
  });
});

