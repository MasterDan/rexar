import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { defineComponent } from '..';
import { Component } from '../component';

export interface ITextComponentProps {
  value: Ref<string>;
}

export const textComponentName = 'text';

export const textComponent = defineComponent<ITextComponentProps>({
  props: {
    value: ref$(''),
  },
  name: textComponentName,
});

export function text(
  props: ITextComponentProps,
): Component<ITextComponentProps> {
  const component = textComponent.create();
  component.bindProps(props);
  return component;
}
