import { extractId } from '.';

describe('id-checks', () => {
  test('should-succeed', () => {
    expect(extractId('::foo')).toBe('foo');
    expect(extractId('::foo:bar')).toBe('foo:bar');
    expect(extractId('::foo:bar-baz')).toBe('foo:bar-baz');
  });
  test('should-be-null', () => {
    expect(extractId('foo::')).toBeNull();
    expect(extractId('foo::sadasads')).toBeNull();
    expect(extractId(':foo::sas')).toBeNull();
  });
});
