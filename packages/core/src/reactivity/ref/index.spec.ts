import { lastValueFrom, timer } from 'rxjs';
import { ref$ } from '.';

const wait = () => lastValueFrom(timer(20));

describe('refs', () => {
  test('simple value', () => {
    const foo$ = ref$('Foo');
    const bar$ = ref$(foo$);
    expect(foo$.val).toBe('Foo');
    expect(bar$.val).toBe('Foo');
  });
  test('simple computed', async () => {
    const name = ref$('John');
    const surname = ref$('Doe');
    const fullName = ref$(() => `${name.val} ${surname.val}`, {
      debounce: 16,
    });
    expect(fullName.val).toBe('John Doe');
    name.val = 'Jane';
    expect(fullName.val).toBe('John Doe');
    await wait();
    expect(fullName.val).toBe('Jane Doe');
  });
  test('conditional computed', async () => {
    const conditionOne = ref$(true);
    const conditionTwo = ref$(true);
    const checker = ref$(() => {
      if (conditionOne.val) {
        return 'first';
      }
      if (conditionTwo.val) {
        return 'second';
      }
      return 'none';
    });
    expect(checker.val).toBe('first');
    conditionOne.val = false;
    expect(checker.val).toBe('second');
    conditionTwo.val = false;
    expect(checker.val).toBe('none');
    conditionOne.val = true;
    expect(checker.val).toBe('first');
  });
});
