import { defineComponent } from '@core/component';
import { h, fragment } from '@rexar/jsx';
import { MaybeObservable, ref } from '@rexar/reactivity';
import { combineLatest, filter, isObservable, map } from 'rxjs';
import { useDynamic } from '../dynamic';

type CheckFn<TValue> = (value: TValue) => boolean;

export function useSwitch<TValue>() {
  const valueRef = ref<TValue>();
  const cases = ref<CheckFn<TValue>[]>([]);

  const useDefault = combineLatest([valueRef, cases]).pipe(
    map(([value, c]) => {
      if (value == null) {
        return true;
      }
      return !c.some((check) => check(value));
    }),
  );

  const setCase = (fn: CheckFn<TValue>) => {
    cases.value.push(fn);
  };

  // combineLatest([cases, valueRef, defaultComponentRef])
  //   .pipe(
  //     map(([c, v, d]) => {
  //       const validCase = c.find(({ check }) => check(v!));
  //       return validCase ? validCase.component : d;
  //     }),
  //   )
  //   .subscribe((comp) => {
  //     setDynamic(comp ?? null);
  //   });

  const Switch = defineComponent<{ value: MaybeObservable<TValue> }>(
    ({ value, children }) => {
      if (isObservable(value)) {
        value.subscribe((v) => {
          valueRef.value = v;
        });
      } else {
        valueRef.value = value as TValue;
      }
      return <>{children}</>;
    },
  );

  const Case = defineComponent<{ check: TValue | CheckFn<TValue> }>(
    ({ check, children }) => {
      const [Dynamic, setDynamic] = useDynamic();
      const checkFn: CheckFn<TValue> =
        typeof check === 'function'
          ? (check as CheckFn<TValue>)
          : (v) => v === check;
      setCase(checkFn);
      valueRef.pipe(filter((v): v is TValue => v != null)).subscribe((v) => {
        setDynamic(checkFn(v) ? () => <>{children}</> : null);
      });
      return <Dynamic></Dynamic>;
    },
  );

  const Default = defineComponent(({ children }) => {
    const [Dynamic, setDynamic] = useDynamic();

    useDefault.subscribe((defaultCase) => {
      setDynamic(defaultCase ? () => <>{children}</> : null);
    });
    return <Dynamic></Dynamic>;
  });

  return [Switch, Case, Default] as const;
}
