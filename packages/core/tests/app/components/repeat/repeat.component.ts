import { defineComponent } from '@core/components';
import { repeatTemplate } from '@core/components/builtIn/custom/hooks/pick-template.hook';
import { bindTextContent } from '@core/components/builtIn/custom/hooks/text-content.hook';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import html from './repeat.component.html';

export const repeatComponent = defineComponent<{ array$: Ref<string[]> }>({
  props: () => ({ array$: ref$<string[]>([]) }),
  template: () => html,
  setup({ props }) {
    repeatTemplate({
      templateId: 'item-template',
      array: props.array$,
      key: (i) => i,
      setup({ props: elemProps }) {
        const text$ = ref$(() => elemProps.item.value?.value ?? '');
        bindTextContent('value', text$);
      },
    }).mount('items');
  },
});
