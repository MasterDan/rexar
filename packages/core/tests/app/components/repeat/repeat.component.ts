import { defineComponent } from '@core/components';
import { repeatTemplate } from '@core/components/builtIn/custom/hooks/pick-template.hook';
import { pickElement } from '@core/components/builtIn/custom/hooks/use-element.hook';
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
        pickElement('value').bindContent.text(text$);
      },
    }).mount('items');
  },
});
