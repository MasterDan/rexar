/* eslint-disable @typescript-eslint/no-unused-vars */
// #region snippet
import { computed, ref } from '@rexar/core';

const name$ = ref('john');
const surname$ = ref('Doe');

const fullName$ = computed(() => `${name$.value} ${surname$.value}`);

const fullNameWritable$ = computed(
  () => `${name$.value} ${surname$.value}`,
  (val) => {
    if (val) {
      [name$.value, surname$.value] = val.split(' ');
    }
  },
);
// #endregion snippet
