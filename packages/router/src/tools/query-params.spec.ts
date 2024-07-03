import { describe, expect, test } from 'vitest';
import { QueryParams } from './query-params';

describe('query params parser', () => {
  test('from string', () => {
    expect(QueryParams.parse('')).toEqual(['', {}]);
    expect(QueryParams.parse('?a=1')).toEqual(['', { a: '1' }]);
    expect(QueryParams.parse('?a=1&b=2&c=3')).toEqual([
      '',
      { a: '1', b: '2', c: '3' },
    ]);
    expect(QueryParams.parse('a=1&b=2&c=3')).toEqual(['a=1&b=2&c=3', {}]);
  });
  test('to string', () => {
    expect(QueryParams.stringify({})).toBe('');
    expect(QueryParams.stringify({ a: '1' })).toBe('?a=1');
    expect(QueryParams.stringify({ a: '1', b: '2', c: '3' })).toBe(
      '?a=1&b=2&c=3',
    );
  });
});

