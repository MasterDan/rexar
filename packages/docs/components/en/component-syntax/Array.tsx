import { computed, defineComponent, ref } from '@rexar/core';

export const ArrayExample = defineComponent(() => {
  const array$ = ref([1, 2, 3]);
  const next$ = computed(() => array$.value.length + 1);
  return (
    <>
      <button
        onClick={() => {
          array$.value.push(next$.value);
        }}
      >
        Push {next$}
      </button>
      <pre>{() => JSON.stringify(array$.value, null, 2)}</pre>
    </>
  );
});
