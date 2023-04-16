import { catchHooks, defineHook, hookScope } from './hooks';

describe('hooks-next', () => {
  test('simple hook', () => {
    const { end, track$ } = hookScope.beginScope();
    const { hooks, trigger } = catchHooks(track$, 'onEnd');
    const onEnd = defineHook('onEnd');
    let check: string | null = null;
    const func = () => {
      onEnd(() => {
        check = 'checked';
      });
    };
    func();
    expect(hooks.onEnd).not.toBeUndefined();
    expect(check).toBeNull();
    trigger('onEnd');
    expect(check).toBe('checked');
    end();
  });
});
