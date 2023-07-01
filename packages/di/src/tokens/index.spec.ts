/* eslint-disable max-classes-per-file */
import { container } from '../container/di-container';
import { useClass } from './class.token';
import { useFunction } from './function.token';
import { singleton } from './singleton.token';
import { useValue } from './value.token';

class TestInner {
  val = 'foo';
}

class TestClass {
  val = 'bar';

  constructor(public inner: TestInner) {}
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
});
