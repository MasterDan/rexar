import { defineComponent } from '..';

export interface IElementComponentProps {
  name: string;
  attrs: Record<string, string>;
}

export const htmlElementDefinitionName = 'html-element';

export const htmlElementComponent = defineComponent<IElementComponentProps>({
  name: htmlElementDefinitionName,
});
