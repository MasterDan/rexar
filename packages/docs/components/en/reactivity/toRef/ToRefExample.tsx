import { defineComponent, ref, toRef, fragment, h } from '@rexar/core';
import { map } from 'rxjs';

export const ToRefExample = defineComponent(() => {
  const count$ = ref(0);
  // observable
  const plusTen$ = count$.pipe(map((x) => x + 10));
  // ref from observable
  const plusTenRef$ = toRef(plusTen$, (v) => {
    count$.value = (v ?? 0) - 10;
  });

  return (
    <>
      <span>
        {count$} + 10 = {plusTenRef$}
      </span>
      <input
        type="number"
        value={plusTenRef$}
        onInput={(e) => {
          plusTenRef$.value = +(e.target as HTMLInputElement).value;
        }}
      />
    </>
  );
});
