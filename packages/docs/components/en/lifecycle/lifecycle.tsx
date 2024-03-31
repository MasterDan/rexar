import {
  defineComponent,
  onBeforeDestroy,
  onDestroyed,
  onMounted,
  onRendered,
  ref,
  EventTrigger,
} from '@rexar/core';
import { filter } from 'rxjs';

export const Lifecycle = defineComponent<{
  name: string;
  onStatusChange: EventTrigger<string>;
}>(({ name, onStatusChange, children }) => {
  const status$ = ref<string>();
  status$.pipe(filter((x): x is string => x != null)).subscribe((status) => {
    onStatusChange(`${name} is ${status}`);
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
