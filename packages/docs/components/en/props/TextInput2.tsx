import {
  Ref,
  defineComponent,
  h,
  fragment,
  useDefaultValues,
} from '@rexar/core';

export const TextInput = defineComponent<{
  value$: Ref<string>;
  label: string;
  id?: string;
}>((props) => {
  const { value$, label, id } = useDefaultValues(props, {
    id: () => crypto.randomUUID(),
  });
  return (
    <>
      <label for={id}>
        {label} | id="{id}"
      </label>
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
