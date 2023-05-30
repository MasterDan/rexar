import { defineComponent, innerTextFor } from '@rexar/core';

// @ts-expect-error import template
import template from 'bundle-text:./inner.component.html';

export interface IInnerComponnentProps {
  message: string;
}

export const inner = defineComponent<IInnerComponnentProps>({
  template: () => template,
  props: () => ({ message: 'No Message' }),
  setup: ({ props }) => {
    innerTextFor('message', props.message);
  },
});
