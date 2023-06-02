import { BehaviorSubject } from 'rxjs';
import { WritableReadonlyRef } from './readonly.ref.writable';

describe('writable readonly ref', () => {
  test('simple', () => {
    const bs = new BehaviorSubject('foo');
    const wref = new WritableReadonlyRef(bs, bs.value, (v) => {
      bs.next(v);
    });
    expect(wref.value).toBe('foo');
    wref.value = 'bar';
    expect(bs.value).toBe('bar');
    expect(wref.value).toBe('bar');
  });
});
