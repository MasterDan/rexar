import { TrackableWritableRef } from '@/reactivity/ref/trackable.writable.ref';
import { defineComponent } from '..';

export const textComponent = defineComponent<{
  value: TrackableWritableRef<string>;
}>({
  name: 'text',
});
