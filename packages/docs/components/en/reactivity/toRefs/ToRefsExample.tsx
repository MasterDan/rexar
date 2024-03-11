import { defineComponent, fragment, h, ref, toRefs } from '@rexar/core';

export const ToRefsExample = defineComponent(() => {
  const user$ = ref({
    name: 'John',
    age: 30,
  });
  const { name, age } = toRefs(user$);
  return (
    <>
      <input
        type="text"
        value={name}
        onInput={(e) => {
          name.value = (e.target as HTMLInputElement).value;
        }}
      ></input>
      <input
        type="number"
        value={age}
        onInput={(e) => {
          age.value = +(e.target as HTMLInputElement).value;
        }}
      ></input>
      <span>
        {name} {age}
      </span>
      <span>{() => JSON.stringify(user$.value)}</span>
    </>
  );
});
