import { defineComponent } from '@core/component';
import { onMounted } from '@core/scope';
import { ComponentAttributes, type h } from '@rexar/jsx';
import { Ref, Source, ref } from '@rexar/reactivity';
import { combineLatestWith, filter, switchMap } from 'rxjs';
import { useDynamic } from '../dynamic';

export type TagProps = {
  name: Source<string>;
  attrs?: Source<ComponentAttributes>;
  ref$?: Ref<Element | undefined>;
};

export const Tag = defineComponent<TagProps>(
  ({ name, attrs, children, ref$ }) => {
    const [Dynamic, setContent] = useDynamic();
    const name$ = ref<string>().withSource(name);
    const attrs$ = ref<ComponentAttributes>().withSource(attrs);
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
          // @ts-expect-error h will be imported
          const element = h(tagName, attributes ?? {}, children);

          element$.value = element;
          return element;
        });
      });

    return <Dynamic />;
  },
);

