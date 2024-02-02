import type { SomeRef } from '@reactivity/ref/tools';
import { Hook, Scope } from '@reactivity/scope';
import { toRefProvider } from '@reactivity/anti-cycle/anti-cycle';
import type { WritableReadonlyRef } from '@reactivity/ref/writable-readonly.ref';
import type { ReadonlyRef } from '@reactivity/ref/readonly.ref';
import { AnyObservable } from '@reactivity/@types';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  switchMap,
} from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HookRef = SomeRef<any>;

export const trackingScope = new Scope<
  AnyObservable,
  {
    onTrack: HookRef;
  }
>();

export const onTrack = trackingScope.createHook('onTrack');

export function computed<T>(getter: () => T): ReadonlyRef<T>;
export function computed<T>(
  getter: () => T,
  setter: (value?: T) => void,
): WritableReadonlyRef<T>;
export function computed<T>(
  getter: () => T,
  setter?: (value?: T) => void,
): WritableReadonlyRef<T> | ReadonlyRef<T> {
  const emitter = new BehaviorSubject<T | undefined>(
    undefined,
  ) as BehaviorSubject<T>;
  const key = Symbol('computed');
  const hooks = new BehaviorSubject<HookRef[]>([]);
  hooks
    .pipe(switchMap((v) => combineLatest(v)))
    .pipe(debounceTime(16))
    .subscribe(() => {
      const scopeNeedsToRecreate = trackingScope.current?.key !== key;
      if (scopeNeedsToRecreate) {
        trackingScope.begin(key, emitter);
      }
      emitter.next(getter());
      if (scopeNeedsToRecreate) {
        trackingScope.end();
      }
    });
  const catcher = trackingScope.begin(key, emitter) as Observable<
    Hook<HookRef>
  >;
  catcher.subscribe(({ body }) => {
    body.track(key);
    hooks.next(hooks.value.concat(body));
  });
  emitter.next(getter());
  trackingScope.end();
  return setter
    ? toRefProvider.value(emitter, setter)
    : toRefProvider.value(emitter);
}
