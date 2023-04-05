import { HooksLab } from '.';
import { FunctionalHook } from './functional-hook';

describe('hooks', () => {
  test('simple-hook', () => {
    const lab = new HooksLab<
      void,
      string,
      { foo: FunctionalHook<void, string> }
    >();
    const fooHook = lab.defineHook('foo');
    const onFoo = (fn: () => string) => fooHook(new FunctionalHook(fn));

    const r = lab.callFunction(() => {
      onFoo(() => 'hello');
      onFoo(() => 'world');
      return 'bar';
    });
    expect(r).toBe('bar');
    const hr = lab.callHooks<'foo', FunctionalHook<void, string>>(
      'foo',
      undefined,
    );
    expect(hr).toEqual(['hello', 'world']);
  });
});
