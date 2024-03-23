import {
  defineComponent,
  h,
  fragment,
  onBeforeDestroy,
  onDestroyed,
  onMounted,
  onRendered,
  ref,
} from '@rexar/core';
import { Subject, filter } from 'rxjs';

export const Lifecycle = defineComponent<{
  name: string;
  statusChanged$: Subject<string>;
}>(({ name, statusChanged$, children }) => {
  const status$ = ref<string>();
  status$.pipe(filter((x): x is string => x != null)).subscribe((status) => {
    statusChanged$.next(`${name} is ${status}`);
  });
  onRendered().subscribe(() => {
    status$.value = 'Rendered';
  });
  onMounted().subscribe(() => {
    status$.value = 'Mounted';
  });
  onBeforeDestroy().subscribe(() => {
    status$.value = 'Before Destroy';
  });
  onDestroyed().subscribe(() => {
    status$.value = 'Destroyed';
  });
  return (
    <>
      <div>
        {name}: {status$}
      </div>
      {children}
    </>
  );
});
