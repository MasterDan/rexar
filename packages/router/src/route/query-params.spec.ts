import { describe, expect, test } from 'vitest';
import { queryParamsFromString, queryParamsToString } from './query-params';

describe('query params parser', () => {
  test('from string', () => {
    expect(queryParamsFromString('')).toEqual(['', {}]);
    expect(queryParamsFromString('?a=1')).toEqual(['', { a: '1' }]);
    expect(queryParamsFromString('?a=1&b=2&c=3')).toEqual([
      '',
      { a: '1', b: '2', c: '3' },
    ]);
    expect(queryParamsFromString('a=1&b=2&c=3')).toEqual(['a=1&b=2&c=3', {}]);
  });
  test('to string', () => {
    expect(queryParamsToString({})).toBe('');
    expect(queryParamsToString({ a: '1' })).toBe('?a=1');
    expect(queryParamsToString({ a: '1', b: '2', c: '3' })).toBe(
      '?a=1&b=2&c=3',
    );
  });
});

