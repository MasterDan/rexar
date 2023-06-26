import { createToken } from '.';
import { useValue } from './value-token';

describe('dependecy injection', () => {
  test('value injection', () => {
    const valueToken = createToken<number>('value').pipe(useValue(5));
    const value = valueToken.resolve();
    expect(value).toBe(5);
  });
});
