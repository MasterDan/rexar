import { describe, expect, test } from 'vitest';
import { Path } from './path';

describe('Path', () => {
  test('empty path', () => {
    const path = new Path([]);
    expect(path.size).toBe(0);
    expect(path.value).toBe('/');
  });
  test('empty path from string', () => {
    const path = Path.fromString('');
    expect(path.size).toBe(0);
    expect(path.value).toBe('/');
  });
  test('empty path from alt string', () => {
    const path = Path.fromString('/');
    expect(path.size).toBe(0);
    expect(path.value).toBe('/');
  });
  test('single node path', () => {
    const path = new Path(['foo']);
    expect(path.size).toBe(1);
    expect(path.value).toBe('/foo');
  });
  test('simple path from string', () => {
    const path = Path.fromString('/foo/bar/baz');
    const path2 = Path.fromString('foo/bar/baz');
    expect(path.size).toBe(3);
    expect(path2.size).toBe(3);
    expect(path.value).toBe('/foo/bar/baz');
    expect(path2.value).toBe('/foo/bar/baz');
    expect(path.includes(path2)).toBe(true);
  });
  test('path with query params', () => {
    const path = Path.fromString('/foo/bar/baz?a=b&c=d');
    expect(path.size).toBe(3);
    expect(path.value).toBe('/foo/bar/baz?a=b&c=d');
    expect(path.queryParams).toEqual({ a: 'b', c: 'd' });
    path.queryParams = { a: 'b', c: 'd', e: 'f' };
    expect(path.value).toBe('/foo/bar/baz?a=b&c=d&e=f');
  });
  test('path with params', () => {
    const pathWithParams = Path.fromString('/foo/:bar/:baz');
    const path = Path.fromString('/foo/barVal/bazVal');
    expect(pathWithParams.size).toBe(3);
    expect(path.size).toBe(3);
    expect(pathWithParams.matches('/foo')).toBe(false);
    expect(pathWithParams.matches('/foo/barVal')).toBe(false);
    expect(pathWithParams.matches('/foo/barVal/bazVal')).toBe(true);
    expect(pathWithParams.matches('/foo/barVal/bazVal/extraVal')).toBe(false);
    expect(pathWithParams.includes(path)).toBe(true);
    expect(path.includes(pathWithParams)).toBe(false);
    const pathWithFilledParams = pathWithParams.withParams({
      bar: 'barVal',
      baz: 'bazVal',
    });
    expect(pathWithFilledParams.size).toBe(3);
    expect(pathWithFilledParams.value).toBe('/foo/barVal/bazVal');
    expect(pathWithFilledParams.includes(path)).toBe(true);
    expect(path.includes(pathWithFilledParams)).toBe(true);
    expect(pathWithFilledParams.includes(pathWithParams)).toBe(false);
  });
  test('path slice', () => {
    const path = Path.fromString('base/foo/bar/baz');
    expect(path.slice(0, 2).value).toBe('/base/foo');
    expect(path.slice(1, 3).value).toBe('/foo/bar/baz');
    expect(path.slice(2, 2).value).toBe('/bar/baz');
    expect(path.slice(3, 1).value).toBe('/baz');
  });
});

