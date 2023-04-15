import { defineHook, hookScope } from './hooks';

describe('hooks-next', () => {
  test('simple hook', () => {
    const { end, track$ } = hookScope.beginScope();
    let check: string | null = null;
    const onEnd = defineHook<(fn: () => void) => void>(
      (track) => (fn: () => void) => {
        track({
          name: 'onEnd',
          call: fn,
        });
      },
    );
    const func = () => {
      onEnd(() => {
        check = 'checked';
      });
    };
  });
});
