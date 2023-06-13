import { defineComponent } from '@core/components';
import { pickTemplate, transformElement } from '@core/index';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import template from './if-else-slots-test.component.html';

export const ifElseSotsTest = defineComponent<{ toggler$: Ref<boolean> }>({
  template: () => template,
  props: () => ({ toggler$: ref$(false) }),
  setup: ({ props }) => {
    transformElement('simple-slot').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
    pickTemplate('inner-content').defineComponent().mount('inner-slot');
  },
});
