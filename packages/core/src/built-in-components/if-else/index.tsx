import { Source, ref } from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { distinctUntilChanged, filter } from 'rxjs';
import { DynamicRenderFunc, useDynamic } from '../dynamic';
import { Waiter } from '../dynamic/waiter';

export const Show = defineComponent<{
  when: Source<boolean>;
  content?: DynamicRenderFunc;
  fallback?: DynamicRenderFunc;
  waiter?: Waiter;
}>(({ when, content, fallback, waiter }) => {
  const valueRef = ref<boolean>().withSource(when);

  const [Dynamic, update] = useDynamic(null, waiter);

  valueRef
    .pipe(
      filter((v): v is boolean => v != null),
      distinctUntilChanged(),
    )
    .subscribe((val) => {
      if (val) {
        update(content ?? null);
      } else {
        update(fallback ?? null);
      }
    });

  return <Dynamic />;
});
