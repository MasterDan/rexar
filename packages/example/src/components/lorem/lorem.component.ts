import { bindValue, defineComponent, ref$ } from '@rexar/core';
// @ts-expect-error import template
import template from 'bundle-text:./lorem.component.html';

export const lorem = defineComponent({
  props: {},
  template,
  setup() {
    const val = ref$<string | undefined>('hello');
    bindValue('#one', val);
    bindValue('#two', val);
  },
});
