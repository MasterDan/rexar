import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { defineComponent } from '..';
import { Component } from '../component';
import { ComponentType } from '../component-type';

export interface ITextComponentProps {
  value: Ref<string>;
  trailingTemplate?: boolean;
}

export const textComponent = defineComponent<ITextComponentProps>({
  props: () => ({
    value: ref$(''),
  }),
  type: ComponentType.Text,
});

export function text(
  props: ITextComponentProps,
): Component<ITextComponentProps> {
  const component = textComponent.create();
  component.bindProps(props);
  return component;
}
