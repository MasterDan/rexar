import { WritableRef } from '@/reactivity/ref/writable.ref';
import { defineComponent } from '..';

export const textComponent = defineComponent<{
  value: WritableRef<string>;
}>({
  name: 'text',
});
