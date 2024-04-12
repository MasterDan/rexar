import { MaybeObservable } from '@reactivity/@types';
import { BehaviorSubject, Observable, isObservable, map } from 'rxjs';
import { AnyRecord } from '@rexar/tools';
import { ReadonlyRef } from './readonly.ref';
import { Ref } from './ref';
import { WritableReadonlyRef } from './writable-readonly.ref';

export type MaybeRef<T> = T | ReadonlyRef<T>;

export function isRef<T>(arg: MaybeRef<T>): arg is ReadonlyRef<T> {
  return arg instanceof ReadonlyRef;
}

export type WritableRef<T> = Ref<T> | WritableReadonlyRef<T>;

export type SomeRef<T> = WritableRef<T> | ReadonlyRef<T>;

export function toRef<T>(
  arg: BehaviorSubject<T>,
  setter: (value: T) => void,
): WritableReadonlyRef<T>;
export function toRef<T>(
  arg: Observable<T>,
  setter: (value: T) => void,
  initialValue: T,
): WritableReadonlyRef<T>;
export function toRef<T>(
  arg: Observable<T>,
  setter: (value?: T) => void,
): WritableReadonlyRef<T | undefined>;
export function toRef<T>(arg: BehaviorSubject<T>): ReadonlyRef<T>;
export function toRef<T>(
  arg: Observable<T>,
  setter: undefined,
  initialValue: T,
): ReadonlyRef<T>;
export function toRef<T>(arg: Observable<T>): ReadonlyRef<T | undefined>;
export function toRef<T>(arg: T): Ref<T>;
export function toRef<T>(
  arg: MaybeObservable<T>,
  setter?: (value?: T) => void,
  initialValue?: T,
): ReadonlyRef<T | undefined> | Ref<T> {
  if (isObservable(arg)) {
    const value: T | undefined =
      arg instanceof BehaviorSubject ? arg.value : initialValue;
    if (setter) {
      const result = new WritableReadonlyRef<T | undefined>(value, setter);
      arg.subscribe((v) => {
        result.next(v);
      });
      return result;
    }

    const result = new ReadonlyRef<T | undefined>(value);
    arg.subscribe((v) => {
      result.next(v);
    });
    return result;
  }
  return new Ref(arg);
}

export type DeconstructedRef<T extends AnyRecord> = {
  [Key in keyof T]: WritableReadonlyRef<T[Key]>;
};

export function toRefs<T extends AnyRecord>(
  objRef: Ref<T>,
): DeconstructedRef<T> {
  const result: AnyRecord = {};
  Object.keys(objRef.value).forEach((key) => {
    result[key] = toRef(objRef.pipe(map((o) => o[key])), (v) => {
      objRef.value[key as keyof T] = v;
    });
  });
  return result as DeconstructedRef<T>;
}
