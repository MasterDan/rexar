import { beforeAll, describe, expect, test } from 'vitest';
import { initCycleDependencies } from '@reactivity/anti-cycle';
import { ref } from './ref';
import { toRef } from './tools';

describe('readonly refs', () => {
  beforeAll(() => {
    initCycleDependencies();
  });
  test('should throw', () => {
    const objRef = ref({ foo: 1, bar: 2 });
    const arrayRef = ref([1, 2]);
    const objReadonly = toRef(objRef);
    const arrayReadonly = toRef(arrayRef);
    expect(objReadonly.value?.bar).toBe(2);
    const tryChangeObject = () => {
      if (objReadonly.value) {
        objReadonly.value.bar = 0;
      }
    };
    const tryChangeArray = () => {
      arrayReadonly.value?.push(3);
    };
    expect(tryChangeObject).toThrowError();
    expect(tryChangeArray).toThrowError();
  });
});
