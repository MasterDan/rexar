import { container } from 'tsyringe';
import { Bar } from './Bar';

describe('tsyringe', () => {
  test('resolve dependencies', () => {
    const bar = container.resolve(Bar);
    expect(bar.test()).toBe('Foo said: Hello from bar');
  });
});
