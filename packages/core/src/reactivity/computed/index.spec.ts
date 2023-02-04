import { lastValueFrom, timer } from 'rxjs';
import { computed } from '.';
import { ref$ } from '../ref';

describe('computed', () => {
  test('simple', async () => {
    const name = ref$('John');
    const surname = ref$('Doe');
    const fullName = computed(() => `${name.val} ${surname.val}`);
    expect(fullName.val).toBe('John Doe');
    name.val = 'Jane';
    await lastValueFrom(timer(17));
    expect(fullName.val).toBe('Jane Doe');
  });
  test('conditional', async () => {
    const conditionOne = ref$(true);
    const conditionTwo = ref$(true);
    const checker = computed(() => {
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
    await lastValueFrom(timer(17));
    expect(checker.val).toBe('second');
    conditionTwo.val = false;
    await lastValueFrom(timer(17));
    expect(checker.val).toBe('none');
    conditionOne.val = true;
    await lastValueFrom(timer(17));
    expect(checker.val).toBe('first');
  });
});
