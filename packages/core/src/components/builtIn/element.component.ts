import { AnyComponent } from '@core/render/html/@types/any-component';
import { container } from '@rexar/di';
import { IComponentDefinitionBuilder } from '../@types/IComponentDefinitionBuilder';
import { ComponentDefinition } from '../component-definition-builder';
import { ComponentType } from '../component-type';

export interface IElementComponentProps {
  name: string;
  attrs?: Record<string, string | null>;
  children?: AnyComponent[];
}

let htmlElementComponentDefinition:
  | ComponentDefinition<IElementComponentProps>
  | undefined;

export function el(props: IElementComponentProps, id?: string) {
  if (htmlElementComponentDefinition == null) {
    const builder = container.resolve<IComponentDefinitionBuilder>(
      'IComponentDefinitionBuilder',
    );
    htmlElementComponentDefinition =
      builder.defineComponent<IElementComponentProps>({
        props: () => ({ name: 'div' }),
        type: ComponentType.HTMLElement,
      });
  }
  const component = htmlElementComponentDefinition.create();
  component.id = id;
  component.bindProps(props);
  return component;
}

