import { computed, defineComponent, ref, h, fragment } from '@rexar/core';

export const ComputedExample = defineComponent(() => {
  const name$ = ref('John');
  const surname$ = ref('Doe');

  const fullName$ = computed(() => `${name$.value} ${surname$.value}`);

  const fullNameWritable$ = computed(
    () => `${name$.value} ${surname$.value}`,
    (val) => {
      if (val) {
        [name$.value, surname$.value] = val.split(' ');
      }
    }
  );
  return (
    <>
      <input
        type="text"
        value={fullNameWritable$}
        onInput={(e) => {
          fullNameWritable$.value = (e.target as HTMLInputElement).value;
        }}
      />
      <span>{fullName$}</span>
      <span>{name$}</span>
      <span>{surname$}</span>
    </>
  );
});
