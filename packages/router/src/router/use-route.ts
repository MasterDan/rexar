import { Ref, createProvider, ref } from '@rexar/core';
import { Observable, Subject, filter, map } from 'rxjs';
import type { AnyRecord } from '@rexar/tools';
import type { RouteView } from './router';

export type RouteInfo = Pick<RouteView, 'params' | 'query'>;

export const routeProvider = createProvider<Observable<RouteInfo>>(
  new Subject<RouteInfo>(),
);

export function useRoute() {
  const route$ = routeProvider.inject();
  const useParams = () => {
    const ref$ = ref<AnyRecord>().withSource(route$.pipe(map((r) => r.params)));
    return ref$;
  };
  const useParam: {
    (param: string, defaultValue: string): Ref<string>;
    (param: string): Ref<string | undefined>;
  } = (param: string, defaultValue?: string) => {
    const ref$ = ref(defaultValue).withSource(
      route$.pipe(
        map((r) => r.params[param]),
        filter((r): r is string => r != null),
      ),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ref$ as Ref<any>;
  };
  return { useParams, useParam };
}

