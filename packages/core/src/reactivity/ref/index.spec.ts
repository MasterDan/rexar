import { ref$ } from '.';

describe('refs', () => {
  test('simple value', () => {
    const foo$ = ref$('Foo');
    expect(foo$.val).toBe('Foo');
  });
});
