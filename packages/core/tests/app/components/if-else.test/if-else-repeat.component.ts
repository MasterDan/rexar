import { defineComponent } from '@core/components';
import { mountComponent, ref$, transformElement } from '@core/index';
import { Ref } from '@core/reactivity/ref/ref';
import { repeatComponent } from '../repeat/repeat.component';
import template from './if-else-repeat.component.html';

export const ifElseRepeat = defineComponent<{
  toggler$: Ref<boolean>;
  array$: Ref<string[]>;
}>({
  template: () => template,
  props: () => ({
    toggler$: ref$(false),
    array$: ref$<string[]>([]),
  }),
  setup: ({ props }) => {
    transformElement('frame').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
    mountComponent('content', repeatComponent, { array$: props.array$ });
  },
});
