import { ref$ } from '@core/reactivity/ref';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';

const referenceHook = defineHook<HTMLElement>(BuiltInHooks.ElementReference);

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
