import { container } from '../container/di-container';
import { useFunction } from './function-token';
import { useValue } from './value-token';

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
});
