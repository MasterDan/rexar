import { HooksLab } from '.';
import { FunctionalHook } from './functional-hook';

describe('hooks', () => {
  test('simple-hook', () => {
    const lab = new HooksLab<
      void,
      string,
      { foo: FunctionalHook<void, string> }
    >();
    const onFoo = lab.defineHook('foo');

    const r = lab.callFunction(() => {
      onFoo(new FunctionalHook(() => 'hello'));
      onFoo(new FunctionalHook(() => 'world'));
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
