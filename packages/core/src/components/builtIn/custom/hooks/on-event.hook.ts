import { filter, fromEvent, merge, switchMap, takeUntil } from 'rxjs';
import { onBeforeUnmount } from './lifecycle.hook';
import { useElement } from './use-element.hook';

export const onEvent = (id: string, ...events: string[]) => {
  if (events.length === 0) {
    throw new Error('Event must be provided');
  }
  const beforeUnmount$ = onBeforeUnmount();
  return useElement(id).pipe(
    filter((el): el is HTMLElement => el != null),
    switchMap((el) => merge(...events.map((event) => fromEvent(el, event)))),
    takeUntil(beforeUnmount$),
  );
};
