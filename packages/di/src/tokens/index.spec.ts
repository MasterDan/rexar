import { container } from '../container/di-container';
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
});
