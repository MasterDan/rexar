import { initCycleDependencies } from '@reactivity/anti-cycle';
import { ref } from '@reactivity/ref/ref';
import { beforeAll, describe, expect, test } from 'vitest';
import { wait } from '@rexar/tools';
import { computed } from '.';

describe('computed', () => {
  beforeAll(() => {
    initCycleDependencies();
  });
  test('simple computed', async () => {
    const name = ref('John');
    const surname = ref('Doe');

    const fullName = computed(() => `${name.value} ${surname.value}`);

    expect(fullName.value).toBe('John Doe');
    name.value = 'Jane';
    await wait(20);
    expect(fullName.value).toBe('Jane Doe');
  });
  test('simple computed writable', async () => {
    const name = ref('John');
    const surname = ref('Doe');

    const fullName = computed(
      () => `${name.value} ${surname.value}`,
      (value) => {
        const [n, s] = value.split(' ');
        name.value = n;
        surname.value = s;
      },
    );

    expect(fullName.value).toBe('John Doe');
    name.value = 'Jane';
    await wait(20);

    expect(fullName.value).toBe('Jane Doe');
    fullName.value = 'John Smith';
    await wait(20);
    expect(name.value).toBe('John');
    expect(surname.value).toBe('Smith');
    expect(fullName.value).toBe('John Smith');
  });
  test('listening arrays', async () => {
    const array = ref([1, 2, 3]);
    const len = computed(() => array.value.length);
    const sum = computed(() => array.value.reduce((a, b) => a + b));
    expect(len.value).toBe(3);
    expect(sum.value).toBe(6);
    array.value.push(2);
    await wait(50);
    expect(len.value).toBe(4);
    expect(sum.value).toBe(8);
  });
  test('listening objects', async () => {
    const obj = ref({ foo: 1, bar: 2 });
    const obj2 = ref({ foo: 3, bar: 4 });

    const fooSum = computed(() => obj.value.foo + obj2.value.foo);
    const barSum = computed(() => obj.value.bar + obj2.value.bar);
    expect(fooSum.value).toBe(4);
    expect(barSum.value).toBe(6);
    obj.value.foo = 2;
    await wait(50);
    expect(fooSum.value).toBe(5);
    obj2.value.bar = 5;
    await wait(50);
    expect(barSum.value).toBe(7);
  });
  test('delayed tracking', async () => {
    const one = ref(true);
    const two = ref(false);
    const computedRef = computed(() => {
      if (one.value) {
        return 'one';
      }
      if (two.value) {
        return 'two';
      }
      return 'three';
    });
    expect(computedRef.value).toBe('one');
    one.value = false;
    await wait(50);
    expect(computedRef.value).toBe('three');
    two.value = true;
    await wait(50);
    expect(computedRef.value).toBe('two');
  });
});
