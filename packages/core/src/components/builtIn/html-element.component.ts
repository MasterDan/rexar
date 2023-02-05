import { defineComponent } from '..';

interface IElementComponentProps {
  name: string;
  attrs: Record<string, string>;
}

export const htmlElementComponent = defineComponent<IElementComponentProps>({
  name: 'html-element',
});
