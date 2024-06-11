import { Tag, defineComponent, ref, useFor } from '@rexar/core';
import { delay, filter } from 'rxjs';

export const CustomTags = defineComponent(() => {
  const Numbers = useFor([1, 2, 3, 4, 5, 6], (i) => i);
  return (
    <Numbers
      each={({ item }) => {
        const el$ = ref<Element>();
        el$
          .pipe(
            filter((i): i is HTMLElement => i != null),
            delay(500 * item.value)
          )
          .subscribe((el) => {
            el.style.setProperty('color', 'rgb(235, 161, 52)');
          });
        return (
          <Tag name={`h${item.value}`} el$={el$}>
            This is h{item}
          </Tag>
        );
      }}
    />
  );
});
