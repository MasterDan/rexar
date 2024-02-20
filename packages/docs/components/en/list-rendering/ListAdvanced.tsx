import {
  defineComponent,
  ref,
  useFor,
  h,
  fragment,
  computed,
} from '@rexar/core';
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
  const reverse = () => {
    array.value.reverse();
  };
  const moveUp = (index: number) => {
    [array.value[index], array.value[index - 1]] = [
      array.value[index - 1],
      array.value[index],
    ];
  };
  const moveDown = (index: number) => {
    [array.value[index], array.value[index + 1]] = [
      array.value[index + 1],
      array.value[index],
    ];
  };
  const Numbers = useFor(array, (i) => i);

  return (
    <>
      <Numbers
        each={({ item, index }) => {
          const start = computed(() => index.value === 0);
          const end = computed(() => index.value === array.value.length - 1);

          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              Item at position {index} has value {item}
              <button disabled={start} onClick={() => moveUp(index.value)}>
                ▲
              </button>
              <button disabled={end} onClick={() => moveDown(index.value)}>
                ▼
              </button>
              <button onClick={() => removeItem(index.value)}>✕</button>
            </div>
          );
        }}
      />
      <button onClick={reverse}>Reverse</button>
    </>
  );
});
