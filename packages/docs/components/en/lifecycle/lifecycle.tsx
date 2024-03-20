import {
  defineComponent,
  h,
  onBeforeDestroy,
  onDestroyed,
  onMounted,
  onRendered,
  ref,
} from '@rexar/core';
import { filter } from 'rxjs';

export const Lifecycle = defineComponent<{
  name: string;
  onStatusChange: (status: string) => void;
}>(({ name, onStatusChange }) => {
  const status$ = ref<string>();
  status$.pipe(filter((x): x is string => x != null)).subscribe((status) => {
    onStatusChange(`${name} is ${status}`);
  });
  onRendered().subscribe(() => {
    status$.value = 'Rendered';
    console.log(name, status$.value);
  });
  onMounted().subscribe(() => {
    status$.value = 'Mounted';
    console.log(name, status$.value);
  });
  onBeforeDestroy().subscribe(() => {
    status$.value = 'Before Destroy';
    console.log(name, status$.value);
  });
  onDestroyed().subscribe(() => {
    status$.value = 'Destroyed';
    console.log(name, status$.value);
  });
  return (
    <div>
      {name}: {status$}
    </div>
  );
});
