import { defineComponent, ref, fragment, h } from '@rexar/core';
import { TextInput } from './TextInput';

export const ParentComponent = defineComponent(() => {
  const name = ref('John');
  const surname = ref('Doe');
  return (
    <>
      <TextInput value={name} label="Name"></TextInput>
      <TextInput value={surname} label="Surname"></TextInput>
      <span>
        Full name is "{name} {surname}"
      </span>
    </>
  );
});
