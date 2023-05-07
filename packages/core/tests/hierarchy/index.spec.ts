import { SubclassOne } from './subclass-one';
import { SubclassTwo } from './subclass-two';

describe('hierarchy test', () => {
  test('simple', () => {
    const one = new SubclassOne();
    const two = new SubclassTwo();
    two.value = ['foo'];
    one.value = ['bar'];

    expect(two.value).toEqual(['foo']);
    expect(one.value).toEqual(['bar']);
  });
});
