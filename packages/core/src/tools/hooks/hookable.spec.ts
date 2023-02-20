import { defineHook, defineHookable } from './hookable';

interface ITestContext {
  foo: string;
}

describe('hookable', () => {
  test('simple', () => {
    const onAfter = defineHook<string, void, ITestContext>(
      'after',
      ({ foo }) => foo,
    );
    const hookableFn = defineHookable<ITestContext, void, { after: void }>(
      (fn, hook) => {
        const context = { foo: 'bar' };
        fn(context);
        hook('after', context);
      },
    );
    let beforeVal: string | null = null;
    let aftrerVal: string | null = null;

    hookableFn((context) => {
      beforeVal = context.foo;
      onAfter((val) => {
        aftrerVal = val;
      });
      context.foo = 'baz';
    });
    expect(beforeVal).toBe('bar');
    expect(aftrerVal).toBe('baz');
    hookableFn((context) => {
      beforeVal = context.foo;
      onAfter((val) => {
        aftrerVal = val;
      });
      context.foo = 'bazz';
    });
    expect(aftrerVal).toBe('bazz');
  });
});
