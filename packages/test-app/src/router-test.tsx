import { defineComponent } from '@rexar/core';
import { onLocationChange } from '@rexar/router';

export const RouterTest = defineComponent(() => {
  onLocationChange().subscribe((loc) => {
    console.log('location changed', loc);
  });
  return (
    <div class="bg-neutral-50 p-8 rounded-3xl bg-opacity-30 flex flex-col gap-8 items-center"></div>
  );
});

