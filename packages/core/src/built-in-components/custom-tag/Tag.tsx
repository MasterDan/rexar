import { defineComponent } from '@core/component';
import { onMounted } from '@core/scope';
import { ComponentAttributes, h } from '@rexar/jsx';
import {
  Ref,
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { combineLatestWith, filter, switchMap } from 'rxjs';
import { useDynamic } from '../dynamic';

export const Tag = defineComponent<{
  name: ValueOrObservableOrGetter<string>;
  attrs?: ValueOrObservableOrGetter<ComponentAttributes>;
  ref$?: Ref<Element | undefined>;
}>(({ name, attrs, children, ref$ }) => {
  const [Dynamic, setContent] = useDynamic();
  const name$ = ref<string>().fromObservable(toObservable(name));
  const attrs$ = ref<ComponentAttributes>().fromObservable(toObservable(attrs));
  const element$ = ref<Element>();

  if (ref$) {
    onMounted()
      .pipe(
        switchMap(() => element$),
        filter((i): i is Element => i != null),
      )
      .subscribe((el) => {
        ref$.value = el;
      });
  }
  name$
    .pipe(
      filter((i): i is string => i != null),
      combineLatestWith(attrs$),
    )
    .subscribe(([tagName, attributes]) => {
      setContent(() => {
        const element = h(tagName, attributes ?? {}, children);

        element$.value = element;
        return element;
      });
    });

  return <Dynamic />;
});

