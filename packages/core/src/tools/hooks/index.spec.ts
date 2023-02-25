import { HooksLab } from '.';

describe('hooks', () => {
  test('simple-hook', () => {
    const lab = new HooksLab<void, string, { foo: () => string }>();
    const onFoo = lab.defineHook('foo');

    const r = lab.callFunction(() => {
      onFoo(() => 'hello');
      onFoo(() => 'world');
      return 'bar';
    });
    expect(r).toBe('bar');
    const hr = lab.callHooks('foo', undefined);
    expect(hr).toEqual(['hello', 'world']);
  });
});
