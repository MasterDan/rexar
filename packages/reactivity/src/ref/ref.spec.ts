import { beforeAll, describe, expect, test } from 'vitest';
import { initCycleDependencies } from '@reactivity/anti-cycle';
import { map } from 'rxjs';
import { ref } from './ref';
import { toRef, toRefs } from './tools';

describe('refs', () => {
  beforeAll(() => {
    initCycleDependencies();
  });
  test('increment value', () => {
    const number = ref(0);
    const plusOne = toRef(number.pipe(map((x) => x + 1)));
    expect(number.value).toBe(0);
    expect(plusOne.value).toBe(1);
    number.value += 2;
    expect(number.value).toBe(2);
    expect(plusOne.value).toBe(3);
  });
  test('change detection in object', () => {
    const obj = ref({
      foo: 1,
      bar: 2,
      arr: [1, 2, 3],
    });
    const sum = toRef(obj.pipe(map(({ bar, foo }) => foo + bar)));
    const arrayLen = toRef(obj.pipe(map(({ arr }) => arr.length)));
    const arraySum = toRef(
      obj.pipe(map(({ arr }) => arr.reduce((a, c) => a + c, 0))),
    );
    expect(sum.value).toBe(3);
    expect(arrayLen.value).toBe(3);
    expect(arraySum.value).toBe(6);
    obj.value.foo += 2;
    expect(sum.value).toBe(5);
    obj.value.arr.push(1);
    expect(arrayLen.value).toBe(4);
    expect(arraySum.value).toBe(7);
  });
  test('change detection in array', () => {
    const arrayRef = ref(['foo', 'bar', 'baz']);
    const arrayLen = toRef(arrayRef.pipe(map((a) => a.length)));

    expect(arrayLen.value).toBe(3);
    arrayRef.value.push('x');
    expect(arrayLen.value).toBe(4);
  });
  test('change detection in Map', () => {
    const mapRef = ref(
      new Map([
        ['foo', 'bar'],
        ['baz', 'x'],
      ]),
    );
    const mapLen = toRef(mapRef.pipe(map((m) => m.size)));
    expect(mapLen.value).toBe(2);
    mapRef.value.set('x', 'y');
    expect(mapLen.value).toBe(3);
    mapRef.value.delete('x');
    expect(mapLen.value).toBe(2);
    expect(mapRef.value.has('x')).toBe(false);
    expect(mapRef.value.get('x')).toBeUndefined();
  });
  test('change detection in Set', () => {
    const setRef = ref(new Set(['foo', 'bar', 'baz']));
    const setLen = toRef(setRef.pipe(map((s) => s.size)));
    expect(setLen.value).toBe(3);
    setRef.value.add('x');
    expect(setLen.value).toBe(4);
    setRef.value.delete('x');
    expect(setLen.value).toBe(3);
    expect(setRef.value.has('x')).toBe(false);
  });
  test('change detection in class', () => {
    class Counter {
      constructor(public count = 0) {}

      increment() {
        this.count += 1;
      }
    }
    const counterRef = ref(new Counter());
    const counterCount = toRef(counterRef.pipe(map((c) => c.count)));
    expect(counterRef.value.count).toBe(0);
    expect(counterCount.value).toBe(0);
    counterRef.value.increment();
    expect(counterCount.value).toBe(1);
  });
  test('ref deconstruction', () => {
    const objRef = ref({ name: 'John', age: 20 });
    const { name, age } = toRefs(objRef);
    expect(name.value).toBe('John');
    expect(age.value).toBe(20);
    objRef.value.name = 'Jane';
    expect(name.value).toBe('Jane');
    age.value = 10;
    expect(objRef.value.age).toBe(10);
    objRef.valueUntracked.age = 1;
    expect(objRef.value.age).toBe(1);
    expect(age.value).toBe(10);
  });
});
