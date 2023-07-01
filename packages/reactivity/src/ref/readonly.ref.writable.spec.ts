import { BindingContext } from '@reactivity/computed/binding-context';
import { bindingContextToken } from '@reactivity/module';
import { BehaviorSubject } from 'rxjs';
import { WritableReadonlyRef } from './readonly.ref.writable';

describe('writable readonly ref', () => {
  beforeAll(() => {
    bindingContextToken.provide(BindingContext);
  });
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
