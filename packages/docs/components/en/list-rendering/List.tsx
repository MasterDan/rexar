import { defineComponent, ref, useFor, h } from '@rexar/core';

export const List = defineComponent(() => {
  const array$ = ref<number[]>([1, 2, 3, 4, 5]);
  const Numbers = useFor(array$, (i) => i);
  return (
    <Numbers
      each={({ item, index }) => (
        <div>
          Item at position {index} has value {item}
        </div>
      )}
    />
  );
});
