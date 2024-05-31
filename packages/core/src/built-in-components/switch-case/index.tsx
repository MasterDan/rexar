import { defineComponent } from '@core/component';
import { Source, ref } from '@rexar/reactivity';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import { DynamicRenderFunc, useDynamic } from '../dynamic';

type CheckFn<TValue> = (value: TValue) => boolean;

export function useSwitch<TValue>(value: Source<TValue>) {
  return defineComponent<{
    setup: (
      setCase: (
        check: TValue | CheckFn<TValue>,
        content: DynamicRenderFunc,
      ) => void,
    ) => void;
    default?: DynamicRenderFunc;
  }>(({ setup, default: defaultContent }) => {
    const [Dynamic, setDynamic] = useDynamic();

    const valueRef = ref<TValue>().withSource(value);

    const cases = ref<[CheckFn<TValue>, DynamicRenderFunc][]>([]);
    const defaultCase = ref<DynamicRenderFunc | undefined>(defaultContent);

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
        distinctUntilChanged(),
      )
      .subscribe((renderFn) => {
        setDynamic(renderFn ?? null);
      });

    return <Dynamic></Dynamic>;
  });
}
