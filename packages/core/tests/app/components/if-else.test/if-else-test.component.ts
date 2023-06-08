import { defineComponent } from '@core/components';
import { transformElement } from '@core/index';
import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import template from './if-else-test.component.html';

export const ifElseTest = defineComponent<{ toggler$: Ref<boolean> }>({
  template: () => template,
  props: () => ({ toggler$: ref$(false) }),
  setup: ({ props }) => {
    transformElement('simple-html').if(props.toggler$, (c) => {
      c.whenTrue.displaySelf();
    });
  },
});
