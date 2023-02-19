import { AnyComponent } from '@core/render/html/@types/any-component';
import { defineComponent } from '..';

export interface IListComponentProps {
  content: AnyComponent[];
}

export const listComponentName = 'list';

export const listComponent = defineComponent<IListComponentProps>({
  name: listComponentName,
});
