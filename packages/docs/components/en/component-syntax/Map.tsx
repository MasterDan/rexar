import { defineComponent, h, fragment, ref, computed } from '@rexar/core';

export const MapExample = defineComponent(() => {
  const map$ = ref(new Map<number, string>([[1, 'value-1']]));
  const next$ = computed(() => map$.value.size + 1);
  const addNew = () => {
    map$.value.set(next$.value, `value-${next$.value}`);
  };
  return (
    <>
      <button onClick={addNew}>
        Set ( {next$}, "value-{next$}" )
      </button>
      <pre>{() => JSON.stringify([...map$.value], null, 2)}</pre>
    </>
  );
});
