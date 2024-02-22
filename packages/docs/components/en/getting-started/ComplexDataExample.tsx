import { defineComponent, ref, fragment, h } from '@rexar/core';

export const ComplexDataExample = defineComponent(() => {
  const number = 12;
  const numberRef = ref(12);
  const stringRef = ref('Hello');
  const booleanRef = ref(true);
  return (
    <>
      <div>Number: {number}</div>
      <div>Number reactive: {numberRef}</div>
      <div>String: {stringRef}</div>
      <div>Boolean: {booleanRef}</div>
    </>
  );
});
