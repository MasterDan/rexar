import { Source, ref } from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { distinctUntilChanged, filter } from 'rxjs';
import { DynamicRenderFunc, useDynamic } from '../dynamic';

export const Show = defineComponent<{
  when: Source<boolean>;
  content?: DynamicRenderFunc;
  fallback?: DynamicRenderFunc;
}>(({ when, content, fallback }) => {
  const valueRef = ref<boolean>().withSource(when);

  const [Dynamic, update] = useDynamic();

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
