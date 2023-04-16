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
  test('multiple scopes', () => {
    const hookIt = defineHook<string>('hookIt');
    let checkOne: string | undefined;
    let checkTwo: string | undefined;
    const scopeOne = hookScope.beginScope();
    const { trigger: triggerFirstScope } = catchHooks(scopeOne.track$);
    const fnOne = () => {
      hookIt((val) => {
        checkOne = `one:${val}`;
      });
      const fnInner = () => {
        hookIt((val) => {
          checkTwo = `two:${val}`;
        });
      };
      const scopeTwo = hookScope.beginScope();
      const { trigger: triggerSecondScope } = catchHooks(scopeTwo.track$);
      fnInner();
      triggerSecondScope<string>('hookIt', 'world');
      scopeTwo.end();
    };
    fnOne();
    scopeOne.end();
    triggerFirstScope<string>('hookIt', 'hello');
    expect(checkOne).toBe('one:hello');
    expect(checkTwo).toBe('two:world');
  });
});
