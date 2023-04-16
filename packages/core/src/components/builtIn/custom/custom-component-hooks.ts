import { ref$ } from '@core/reactivity/ref';
import { defineHook } from '@core/tools/hooks/hooks';

export const onMounted = defineHook('mounted');

const referenceHook = defineHook<HTMLElement>('reference');

export const useElement = (id: string) => {
  const elRef = ref$<HTMLElement>();
  referenceHook(
    (el) => {
      elRef.val = el;
    },
    {
      id,
    },
  );
  return elRef;
};
