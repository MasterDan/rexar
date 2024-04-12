import { defineComponent } from '@core/component';
import { RenderFunction } from '@rexar/jsx';
import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { combineLatest, map } from 'rxjs';
import { useDynamic } from '../dynamic';

type CheckFn<TValue> = (value: TValue) => boolean;

export function useSwitch<TValue>(value: ValueOrObservableOrGetter<TValue>) {
  return defineComponent<{
    setup: (
      setCase: (
        check: TValue | CheckFn<TValue>,
        content: () => JSX.Element,
      ) => void,
    ) => void;
    default?: () => JSX.Element;
  }>(({ setup, default: defaultContent }) => {
    const [Dynamic, setDynamic] = useDynamic();

    const valueRef = ref<TValue>().fromObservable(toObservable(value));

    const cases = ref<[CheckFn<TValue>, RenderFunction][]>([]);
    const defaultCase = ref<RenderFunction | undefined>(defaultContent);

    setup((check, content) => {
      const checkFn: CheckFn<TValue> =
        typeof check === 'function'
          ? (check as CheckFn<TValue>)
          : (v) => v === check;
      cases.value.push([checkFn, content]);
    });

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

    return <Dynamic></Dynamic>;
  });
}
