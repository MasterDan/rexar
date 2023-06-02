import { lastValueFrom, timer } from 'rxjs';
import { ref$ } from '.';

const wait = () => lastValueFrom(timer(20));

describe('refs', () => {
  test('simple value', () => {
    const foo$ = ref$('Foo');
    const bar$ = ref$(foo$);
    expect(foo$.value).toBe('Foo');
    expect(bar$.value).toBe('Foo');
  });
  test('writable readonly ref', () => {
    const foo$ = ref$('Foo');
    const bar$ = ref$(foo$, (x) => {
      foo$.value = x;
    });

    expect(foo$.value).toBe('Foo');
    expect(bar$.value).toBe('Foo');
    bar$.value = 'Bar';
    expect(foo$.value).toBe('Bar');
    expect(bar$.value).toBe('Bar');
  });
  test('simple computed', async () => {
    const name = ref$('John');
    const surname = ref$('Doe');
    const fullName = ref$(() => `${name.value} ${surname.value}`, {
      debounce: 16,
    });
    expect(fullName.value).toBe('John Doe');
    name.value = 'Jane';
    expect(fullName.value).toBe('John Doe');
    await wait();
    expect(fullName.value).toBe('Jane Doe');
  });
  test('conditional computed', async () => {
    const conditionOne = ref$(true);
    const conditionTwo = ref$(true);
    const checker = ref$(() => {
      if (conditionOne.value) {
        return 'first';
      }
      if (conditionTwo.value) {
        return 'second';
      }
      return 'none';
    });
    expect(checker.value).toBe('first');
    conditionOne.value = false;
    expect(checker.value).toBe('second');
    conditionTwo.value = false;
    expect(checker.value).toBe('none');
    conditionOne.value = true;
    expect(checker.value).toBe('first');
  });
  test('writable computed', () => {
    const first$ = ref$('John');
    const second$ = ref$('Smith');
    const writableComputed$ = ref$(
      () => `${first$.value} ${second$.value}`,
      (v) => {
        const [first, second] = v.split(' ');
        first$.value = first;
        second$.value = second;
      },
    );
    expect(writableComputed$.value).toBe('John Smith');
    writableComputed$.value = 'Jane Doe';
    expect(first$.value).toBe('Jane');
    expect(second$.value).toBe('Doe');
    expect(writableComputed$.value).toBe('Jane Doe');
  });
});
