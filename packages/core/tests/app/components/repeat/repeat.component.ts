import { defineComponent } from '@core/components';
import { repeat } from '@core/components/builtIn/custom/hooks/pick-template.hook';
import { innerTextFor, mountComponent } from '@core/index';
import { ref$ } from '@core/reactivity/ref';
import html from './repeat.component.html';

export const repeatComponent = defineComponent({
  template: () => html,
  setup() {
    const array$ = ref$(['One', 'Two', 'Three']);
    const list = repeat({
      templateId: 'item-template',
      array: array$,
      key: (_, i) => i,
      setup({ props }) {
        const text$ = ref$(() => props.item.value?.value ?? '');
        innerTextFor('value', text$);
      },
    });
    mountComponent('items', list.definition, list.props);
  },
});
