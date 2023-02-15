import { lastValueFrom, timer } from 'rxjs';
import { ref$ } from '.';

const wait = () => lastValueFrom(timer(100));

describe('refs', () => {
  test('simple value', () => {
    const foo$ = ref$('Foo');
    expect(foo$.val).toBe('Foo');
  });
  test('simple computed', async () => {
    const name = ref$('John');
    const surname = ref$('Doe');
    const fullName = ref$(() => `${name.val} ${surname.val}`);
    expect(fullName.val).toBe('John Doe');
    name.val = 'Jane';
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
    await wait();
    expect(checker.val).toBe('second');
    conditionTwo.val = false;
    await wait();
    expect(checker.val).toBe('none');
    conditionOne.val = true;
    await wait();
    expect(checker.val).toBe('first');
  });
});
