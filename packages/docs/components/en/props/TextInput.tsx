import { Ref, defineComponent, h, fragment } from '@rexar/core';

export const TextInput = defineComponent<{
  value: Ref<string>;
  label: string;
}>(({ value: valueRef, label }) => {
  const id = crypto.randomUUID();
  return (
    <>
      <label for={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={valueRef}
        onInput={(e) => {
          valueRef.value = (e.target as HTMLInputElement).value;
        }}
      ></input>
    </>
  );
});
