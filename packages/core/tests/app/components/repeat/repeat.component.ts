import { defineComponent } from '@core/components';
import { pickElement } from '@core/components/builtIn/custom/hooks/element-reference.hook';
import { pickTemplate } from '@core/index';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import html from './repeat.component.html';

export const repeatComponent = defineComponent<{ array$: Ref<string[]> }>({
  props: () => ({ array$: ref$<string[]>([]) }),
  template: () => html,
  setup({ props }) {
    pickTemplate('item-template')
      .forEach(props.array$, (i) => i)
      .defineComponent({
        setup: ({ props: elemProps }) => {
          const text$ = ref$(() => elemProps.item.value?.value ?? '');
          pickElement('value').bindContent.text(text$);
        },
      })
      .mount('items');
  },
});
