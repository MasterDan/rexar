import { defineHook, hookScope } from './hooks';

describe('hooks-next', () => {
  test('simple hook', () => {
    const { end, track$ } = hookScope.beginScope();
    let check: string | null = null;
    const onEnd = defineHook('onEnd');
    const func = () => {
      onEnd(() => {
        check = 'checked';
      });
    };

    end();
  });
});
