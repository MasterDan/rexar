import { WritableRef } from '@core/reactivity/ref/writable.ref';
import { defineComponent } from '..';
import { Component } from '../conmponent';

export interface ITextComponentProps {
  value: WritableRef<string>;
}

export const textComponent = defineComponent<ITextComponentProps>({
  name: 'text',
});

export function text(
  props: ITextComponentProps,
): Component<ITextComponentProps> {
  const component = textComponent.create();
  component.bindProps(props);
  return component;
}
