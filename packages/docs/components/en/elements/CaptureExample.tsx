import { Capture, defineComponent, onMounted, ref } from '@rexar/core';
import { delay } from 'rxjs';

export const CaptureExample = defineComponent(() => {
  const el$ = ref<HTMLElement>();
  onMounted()
    .pipe(delay(1000))
    .subscribe(() => {
      if (el$.value) {
        el$.value.textContent = 'Content changed';
      }
    });
  return (
    <Capture el$={el$}>
      <div>Initial content</div>
    </Capture>
  );
});
