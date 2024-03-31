import { Ref, defineComponent } from '@rexar/core';

export const TextInput = defineComponent<{
  value$: Ref<string>;
  label: string;
}>(({ value$, label }) => {
  const id = crypto.randomUUID();
  return (
    <>
      <label for={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value$}
        onInput={(e) => {
          value$.value = (e.target as HTMLInputElement).value;
        }}
      ></input>
    </>
  );
});
