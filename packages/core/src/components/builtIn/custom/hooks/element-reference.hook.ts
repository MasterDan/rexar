import { ref$ } from '@rexar/reactivity';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';
import { ElementRef } from './inner/element-ref';

export interface IElementReferenceHoolParams {
  id: string;
}

const referenceHook = defineHook<
  HTMLElement | undefined,
  IElementReferenceHoolParams
>(BuiltInHooks.ElementReference);

export const pickElement = (id: string) => {
  const elRef = ref$<HTMLElement>();
  referenceHook(
    (el) => {
      // console.log('founded element for id: ', id, ' it is ', el);
      elRef.value = el;
    },
    {
      id,
    },
  );
  return new ElementRef(elRef);
};
