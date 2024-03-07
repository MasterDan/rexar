import { computed, defineComponent, fragment, h, ref } from '@rexar/core';

export const SetExample = defineComponent(() => {
  const set$ = ref(new Set([1, 2, 3]));
  const next$ = computed(() => set$.value.size + 1);
  return (
    <>
      <button
        onClick={() => {
          set$.value.add(next$.value);
        }}
      >
        Add {next$}
      </button>
      <pre>{() => JSON.stringify([...set$.value], null, 2)}</pre>
    </>
  );
});
