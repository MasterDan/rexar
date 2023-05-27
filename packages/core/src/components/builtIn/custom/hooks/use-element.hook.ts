import { ref$ } from '@core/reactivity/ref';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface IElementReferenceHoolParams {
  id: string;
}

const referenceHook = defineHook<HTMLElement, IElementReferenceHoolParams>(
  BuiltInHooks.ElementReference,
);

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
