import { Ref, defineComponent, into, ref$ } from '@rexar/core';
import template from './if-else-test.component.html?raw';

export const ifElseTest = defineComponent<{ toggler$: Ref<boolean> }>({
  template: (c) => c.fromString(template),
  props: () => ({ toggler$: ref$(false) }),
  setup: ({ props }) => {
    into('simple-html').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
    into('simple-slot').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
  },
});