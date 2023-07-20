import { defineComponent } from '@core/components';
import { into, pickTemplate } from '@core/index';
import { ref$, Ref } from '@rexar/reactivity';

import template from './if-else-slots-test.component.html?raw';

export const ifElseSotsTest = defineComponent<{ toggler$: Ref<boolean> }>({
  template: (c) => c.fromString(template),
  props: () => ({ toggler$: ref$(false) }),
  setup: ({ props }) => {
    into('simple-slot').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
    pickTemplate('inner-content').defineComponent().mount('inner-slot');
  },
});
