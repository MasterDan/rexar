import { describe, expect, test } from 'vitest';
import { BehaviorSubject, Subject } from 'rxjs';
import { ref, toRef } from '..';

describe('ref-tools', () => {
  test('to-ref-from-observables', () => {
    const ref$ = ref(0);
    const subj$ = new Subject<number>();
    const bSubj$ = new BehaviorSubject(0);

    const refOfRef = toRef(ref$);
    expect(refOfRef.value).toBe(0);
    ref$.value = 1;
    expect(refOfRef.value).toBe(1);

    const refOfSubj = toRef(subj$);
    expect(refOfSubj.value).toBeUndefined();
    subj$.next(1);
    expect(refOfSubj.value).toBe(1);

    const refOfBehaviorSubj = toRef(bSubj$);
    expect(refOfBehaviorSubj.value).toBe(0);
    bSubj$.next(1);
    expect(refOfBehaviorSubj.value).toBe(1);
  });
  test('to-ref-from-observable-with-initial-value', () => {
    const subj$ = new Subject<number>();
    const refOfSubj = toRef(subj$, undefined, 0);
    expect(refOfSubj.value).toBe(0);
    subj$.next(10);
    expect(refOfSubj.value).toBe(10);

    const refOfSubjWritable = toRef(subj$, (val) => subj$.next(val), 0);
    expect(refOfSubjWritable.value).toBe(0);
    refOfSubjWritable.value = 5;
    expect(refOfSubj.value).toBe(5);
    expect(refOfSubjWritable.value).toBe(5);

    const bSubj$ = new BehaviorSubject(0);
    const refOfBehaviorSubj = toRef(bSubj$, undefined, 100);
    expect(refOfBehaviorSubj.value).toBe(0);
    bSubj$.next(1);
    expect(refOfBehaviorSubj.value).toBe(1);

    const refOfBehaviorSubjWritable = toRef(bSubj$, (v) => bSubj$.next(v), 100);
    expect(refOfBehaviorSubjWritable.value).toBe(1);
    refOfBehaviorSubjWritable.value = 10;
    expect(refOfBehaviorSubj.value).toBe(10);
    expect(refOfBehaviorSubjWritable.value).toBe(10);
  });
});

