import {
  defineComponent,
  ref,
  useFor,
  h,
  fragment,
  computed,
  useIf,
} from "@rexar/core";
import { take, timer } from "rxjs";

export const List = defineComponent(() => {
  const array = ref<number[]>([]);
  timer(0, 1000)
    .pipe(take(6))
    .subscribe((i) => {
      array.value.push(i + 1);
    });
  const remove = (index: number) => {
    array.value.splice(index, 1);
  };
  const reverse = () => {
    array.value.reverse();
  };
  const swap = (index: number, index2: number) => {
    [array.value[index], array.value[index2]] = [
      array.value[index2],
      array.value[index],
    ];
  };
  const moveUp = (index: number) => {
    swap(index, index - 1);
  };
  const moveDown = (index: number) => {
    swap(index, index + 1);
  };
  const Numbers = useFor(array, (i) => i);
  const [[NotEmpty, Empty]] = useIf(computed(() => array.value.length > 0));
  return (
    <>
      <NotEmpty>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Value</th>
              <th style={{ textAlign: "center" }} colSpan={3}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <Numbers
              each={({ item, index }) => {
                const start = computed(() => index.value === 0);
                const end = computed(
                  () => index.value === array.value.length - 1
                );

                return (
                  <tr>
                    <td style={{ textAlign: "right" }}>{index}</td>
                    <td style={{ textAlign: "right" }}>{item}</td>
                    <td>
                      <button
                        disabled={start}
                        onClick={() => moveUp(index.value)}
                      >
                        ▲
                      </button>
                    </td>
                    <td>
                      <button
                        disabled={end}
                        onClick={() => moveDown(index.value)}
                      >
                        ▼
                      </button>
                    </td>
                    <td>
                      <button onClick={() => remove(index.value)}>✕</button>
                    </td>
                  </tr>
                );
              }}
            />
          </tbody>
        </table>
        <button onClick={reverse}>Reverse</button>
      </NotEmpty>
      <Empty>No items</Empty>
    </>
  );
});
