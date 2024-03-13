import { beforeAll, describe, expect, test } from 'vitest';
import { initCycleDependencies } from '@reactivity/anti-cycle';
import { combineLatest, map } from 'rxjs';
import { ref } from './ref';
import { toRef } from './tools';

describe('writable readonly ref', () => {
  beforeAll(() => {
    initCycleDependencies();
  });
  test('simple ref', () => {
    const name = ref('John');
    const surname = ref('Doe');
    const fullName = toRef(
      combineLatest([name, surname]).pipe(map(([n, s]) => `${n} ${s}`)),
      (val) => {
        if (val == null) {
          return;
        }
        const [n, s] = val.split(' ');
        name.value = n;
        surname.value = s;
      },
    );

    expect(name.value).toBe('John');
    expect(surname.value).toBe('Doe');
    expect(fullName.value).toBe('John Doe');

    fullName.value = 'Jane March';
    expect(name.value).toBe('Jane');
    expect(surname.value).toBe('March');
    expect(fullName.value).toBe('Jane March');
  });
});
