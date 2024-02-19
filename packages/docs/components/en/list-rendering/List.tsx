import { defineComponent, ref, useFor, h } from '@rexar/core';
import { take, timer } from 'rxjs';

export const List = defineComponent(() => {
  const array = ref<number[]>([]);
  timer(0, 1000)
    .pipe(take(5))
    .subscribe((i) => {
      array.value.push(i + 1);
    });
  const removeItem = (index: number) => {
    array.value.splice(index, 1);
  };
  const Numbers = useFor(array, (i) => i);
  return (
    <Numbers
      each={({ item, index }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          Item at position {index} has value {item}
          <button onClick={() => removeItem(index.value)}>✕</button>
        </div>
      )}
    />
  );
});
