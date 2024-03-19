import { Providable, ref, trySubscribe } from '@rexar/reactivity';
import { ComponentRenderFunc, defineComponent } from '@core/component';
import { h, fragment } from '@rexar/jsx';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs';
import { useDynamic } from '../dynamic';

export type UseIfResult = [
  [ComponentRenderFunc, ComponentRenderFunc],
  (val: Providable<boolean>) => UseIfResult,
];

export function useIf(
  value: Providable<boolean>,
  not?: Observable<boolean>,
): UseIfResult {
  const notRef = ref<boolean>();
  const valueRef = ref<boolean>();

  trySubscribe(value, (v) => {
    valueRef.value = v;
  });

  not?.subscribe((n) => {
    notRef.value = n;
  });

  const truth$ = combineLatest([valueRef, notRef]).pipe(
    map(([check, notIf]) => {
      if (notIf === true) {
        return null;
      }
      return check;
    }),
  );

  const True = defineComponent(({ children }) => {
    const [Dynamic, SetDynamic] = useDynamic();

    truth$.pipe(distinctUntilChanged()).subscribe((truth) => {
      if (truth == null || truth === false) {
        SetDynamic(null);
      } else {
        SetDynamic(() => <>{children}</>);
      }
    });
    return <Dynamic></Dynamic>;
  });
  const False = defineComponent(({ children }) => {
    const [Dynamic, SetDynamic] = useDynamic();

    truth$.pipe(distinctUntilChanged()).subscribe((truth) => {
      if (truth == null || truth === true) {
        SetDynamic(null);
      } else {
        SetDynamic(() => <>{children}</>);
      }
    });
    return <Dynamic></Dynamic>;
  });
  const elseIf = (val: Providable<boolean>) => {
    const flagNot = combineLatest([
      valueRef.pipe(filter((v): v is boolean => v != null)),
      notRef,
    ]).pipe(map(([check, notIf]) => (notIf == null ? check : !notIf && check)));
    return useIf(val, flagNot);
  };

  return [[True, False], elseIf];
}
