import { ref$, Ref } from '@rexar/reactivity';
import { container } from '@rexar/di';
import { IComponentDefinitionBuilder } from '../@types/IComponentDefinitionBuilder';
import { Component } from '../component';
import { ComponentDefinition } from '../component-definition-builder';
import { ComponentType } from '../component-type';

export interface ITextComponentProps {
  value: Ref<string>;
  trailingComment?: boolean;
}

let textComponentDefinition:
  | ComponentDefinition<ITextComponentProps>
  | undefined;

export function text(
  props: ITextComponentProps,
): Component<ITextComponentProps> {
  if (textComponentDefinition == null) {
    const builder = container.resolve<IComponentDefinitionBuilder>(
      'IComponentDefinitionBuilder',
    );
    textComponentDefinition = builder.defineComponent<ITextComponentProps>({
      props: () => ({
        value: ref$(''),
      }),
      type: ComponentType.Text,
    });
  }
  const component = textComponentDefinition.create();
  component.bindProps(props);
  return component;
}

