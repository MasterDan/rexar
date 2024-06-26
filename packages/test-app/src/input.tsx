import {
  WritableRef,
  defineComponent,
  toRef,
  MaybeObservable,
  useClasses,
} from '@rexar/core';
import { Observable, map } from 'rxjs';

export const Input = defineComponent<{
  model: WritableRef<string> | WritableRef<number>;
  label: MaybeObservable<string>;
}>(({ model, label }) => {
  const inputType = (model as Observable<string | number>).pipe(
    map((x) => (typeof x === 'number' ? 'number' : 'string') as string),
  );
  const toType = toRef(
    inputType.pipe(map((x) => (x === 'string' ? String : Number))),
  );
  const id = crypto.randomUUID();
  return (
    <>
      <label class="mr-3" for={id}>
        {label}
      </label>
      <input
        class={useClasses([
          'px-4',
          'py-2',
          'rounded-full',
          'bg-white',
          'bg-opacity-50',
          'outline-none',
        ])}
        type={inputType}
        id={id}
        onInput={(e) => {
          model.value = toType.value!((e.target! as HTMLInputElement).value);
        }}
        value={model}
      ></input>
    </>
  );
});
