import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';

export interface IElementComponentProps {
  name: string;
  attrs?: Record<string, string | null>;
  children?: AnyComponent[];
}

export const htmlElementDefinitionName = 'html-element';

export const htmlElementComponent = defineComponent<IElementComponentProps>({
  name: htmlElementDefinitionName,
});

export function el(props: IElementComponentProps) {
  const component = htmlElementComponent.create();
  component.bindProps(props);
  return component;
}
