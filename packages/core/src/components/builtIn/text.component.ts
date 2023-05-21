import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { defineComponent } from '..';
import { Component } from '../component';
import { ComponentType } from '../component-type';

export interface ITextComponentProps {
  value: Ref<string>;
  trailingComment?: boolean;
}

const textComponentDefinition = defineComponent<ITextComponentProps>({
  props: () => ({
    value: ref$(''),
  }),
  type: ComponentType.Text,
});

export function text(
  props: ITextComponentProps,
): Component<ITextComponentProps> {
  const component = textComponentDefinition.create();
  component.bindProps(props);
  return component;
}
