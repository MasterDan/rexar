import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { defineComponent } from '@core/component';
import { distinctUntilChanged, filter } from 'rxjs';
import { useDynamic } from '../dynamic';

export const Show = defineComponent<{
  when: ValueOrObservableOrGetter<boolean>;
  content?: () => JSX.Element;
  fallback?: () => JSX.Element;
}>(({ when, content, fallback }) => {
  const valueRef = ref<boolean>().fromObservable(toObservable(when));

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
