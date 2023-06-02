import {
  defineComponent,
  innerTextFor,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
} from '@rexar/core';

import template from 'bundle-text:./inner.component.html';

export interface IInnerComponnentProps {
  message: string;
}

export const inner = defineComponent<IInnerComponnentProps>({
  template: () => template,
  props: () => ({ message: 'No Message' }),
  setup: ({ props }) => {
    innerTextFor('message', props.message);
    onMounted(() => {
      console.log(
        'inner comonent with message\n',
        props.message.value,
        '\nbeen mounted',
      );
    });
    onBeforeUnmount(() => {
      console.log(
        'inner comonent with message\n',
        props.message.value,
        '\ngoing to unmount',
      );
    });
    onUnmounted(() => {
      console.log(
        'inner comonent with message\n',
        props.message.value,
        '\nbeen un-mounted',
      );
    });
  },
});
