import { defineComponent } from '@core/component';
import { h, fragment, RenderFunction } from '@rexar/jsx';
import { MaybeObservable, ref } from '@rexar/reactivity';
import { combineLatest, isObservable, map } from 'rxjs';
import { useDynamic } from '../dynamic';

type CheckFn<TValue> = (value: TValue) => boolean;

export function useSwitch<TValue>(value: MaybeObservable<TValue>) {
  const [Dynamic, setDynamic] = useDynamic();

  const valueRef = ref<TValue>();
  const cases = ref<[CheckFn<TValue>, RenderFunction][]>([]);
  const defaultCase = ref<RenderFunction>();

  if (isObservable(value)) {
    value.subscribe((v) => {
      valueRef.value = v;
    });
  } else {
    valueRef.value = value as TValue;
  }

  combineLatest([valueRef, cases, defaultCase])
    .pipe(
      map(([v, c, d]) => {
        if (v == null) {
          return d;
        }
        const matched = c.find(([check]) => check(v));
        if (matched) {
          return matched[1];
        }
        return d;
      }),
    )
    .subscribe((renderFn) => {
      setDynamic(renderFn ?? null);
    });

  const Switch = defineComponent(() => <Dynamic></Dynamic>);

  const Case = defineComponent<{ check: TValue | CheckFn<TValue> }>(
    ({ check, children }) => {
      const checkFn: CheckFn<TValue> =
        typeof check === 'function'
          ? (check as CheckFn<TValue>)
          : (v) => v === check;
      cases.value.push([checkFn, () => <>{children}</>]);
      return <></>;
    },
  );

  const Default = defineComponent(({ children }) => {
    defaultCase.value = () => <>{children}</>;
    return <></>;
  });

  return [Switch, Case, Default] as const;
}
