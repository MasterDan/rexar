/* eslint-disable max-classes-per-file */
import { describe, test, expect } from 'vitest';
import { container } from './container/di-container';
import { useClass } from './tokens/class.token';
import { useFunction } from './tokens/function.token';
import { Lazy } from './tokens/lazy';
import { lazy } from './tokens/lazy.token';
import { multiple } from './tokens/multiple.token';
import { singleton } from './tokens/singleton.token';
import { useValue } from './tokens/value.token';

class TestInner {
  val = 'foo';
}

class TestClass {
  val = 'bar';

  constructor(public inner: TestInner) {}
}

class TestInnerLazy {
  val = 'foo';

  constructor(public inner: Lazy<TestLazyClass>) {}
}

class TestLazyClass {
  val = 'bar';

  constructor(public inner: Lazy<TestInnerLazy>) {}
}

describe('dependecy injection', () => {
  test('value injection', () => {
    const valueToken = container.createToken('value', useValue<number>());
    valueToken.provide(5);
    const value = valueToken.resolve();
    const valueCopy = container.resolve<number>('value');
    expect(value).toBe(5);
    expect(valueCopy).toBe(5);
  });
  test('function injection', () => {
    const valueToken = container.createToken('value', useValue<number>());
    valueToken.provide(5);

    const functionToken = container.createToken(
      'func',
      useFunction<number, [number, number], [number]>((c, first) => [
        first,
        c.resolve<number>('value'),
      ]),
    );
    functionToken.provide((x, y) => x + y);
    const addValue = functionToken.resolve();
    expect(addValue(2)).toBe(7);

    const simpleFunctionToken = container.createToken(
      'simple-func',
      useFunction<number, [number, number]>(),
    );
    simpleFunctionToken.provide((x, y) => x * y);
    const multi =
      container.resolve<(x: number, y: number) => number>('simple-func');
    expect(multi(2, 3)).toBe(6);
  });
  test('class innjection', () => {
    const innerToken = container.createToken(
      'inner-class',
      useClass<TestInner>(),
    );
    innerToken.provide(TestInner);
    const classToken = container.createToken(
      'test-class',
      useClass<TestClass>((c) => [c.resolve('inner-class')]),
    );
    classToken.provide(TestClass);
    const testClassInst = classToken.resolve();
    expect(testClassInst.inner.val).toBe('foo');
    expect(testClassInst.val).toBe('bar');
  });
  test('singleton Injection', () => {
    const innerToken = container.createToken(
      'inner-class',
      useClass<TestInner>(),
    );
    innerToken.provide(TestInner);
    const classToken = container.createToken(
      'test-class',
      useClass<TestClass>((c) => [c.resolve('inner-class')]),
    );
    const classTokenSingleton = container.createToken(
      'test-class',
      useClass<TestClass>((c) => [c.resolve('inner-class')]),
      singleton(),
    );
    classToken.provide(TestClass);
    classTokenSingleton.provide(TestClass);

    const tc = classToken.resolve();
    const tc2 = classToken.resolve();
    expect(tc.val).toBe('bar');
    expect(tc2.val).toBe('bar');
    tc2.val = 'baz';
    expect(tc.val).toBe('bar');
    expect(tc2.val).toBe('baz');

    const stc = classTokenSingleton.resolve();
    const stc2 = classTokenSingleton.resolve();
    expect(stc.val).toBe('bar');
    expect(stc2.val).toBe('bar');
    stc2.val = 'baz';
    expect(stc.val).toBe('baz');
    expect(stc2.val).toBe('baz');
  });
  test('lazy injection', () => {
    const classToken = container.createToken(
      'lazy',
      useClass<TestLazyClass>((c) => [c.resolve('inner-lazy')]),
      singleton(),
      lazy(),
    );
    classToken.provide(TestLazyClass);
    const innerClassToken = container.createToken(
      'inner-lazy',
      useClass<TestInnerLazy>((c) => [c.resolve('lazy')]),
      lazy(),
    );
    innerClassToken.provide(TestInnerLazy);
    const instance = classToken.resolve();
    expect(instance.value.val).toBe('bar');
    expect(instance.value.inner.value.val).toBe('foo');
    expect(instance.value.inner.value.inner.value.val).toBe('bar');
    instance.value.val = 'baz';
    expect(instance.value.val).toBe('baz');
    expect(instance.value.inner.value.inner.value.val).toBe('baz');
  });
  test('multiple resolve', () => {
    const token = container.createToken(
      'multi',
      useValue<number>(),
      multiple(),
    );
    token.provide(1);
    token.provide(2);
    token.provide(3);
    expect(token.resolve()).toEqual([1, 2, 3]);
  });
});
