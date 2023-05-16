import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';
import { ComponentType } from '../component-type';

export interface IElementComponentProps {
  name: string;
  attrs?: Record<string, string | null>;
  children?: AnyComponent[];
}

export const htmlElementComponent = defineComponent<IElementComponentProps>({
  props: () => ({ name: 'div' }),
  type: ComponentType.HTMLElement,
});

export function el(props: IElementComponentProps, id?: string) {
  const component = htmlElementComponent.create();
  component.id = id;
  component.bindProps(props);
  return component;
}
