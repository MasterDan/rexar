import { WritableRef } from '@/reactivity/ref/writable.ref';
import { defineComponent } from '..';

export interface ITextComponentProps {
  value: WritableRef<string>;
  hasNextSibling: boolean;
}

export const textComponent = defineComponent<ITextComponentProps>({
  name: 'text',
});
