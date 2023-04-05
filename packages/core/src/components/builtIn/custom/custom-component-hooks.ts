import { ref$ } from '@core/reactivity/ref';
import { Ref } from '@core/reactivity/ref/ref';
import { HooksLab } from '@core/tools/hooks';
import { DataHook } from '@core/tools/hooks/data-hook';
import { FunctionalHook } from '@core/tools/hooks/functional-hook';
import { Observable } from 'rxjs';
import { ISetupContext } from './custom-template-component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericProps = Record<string, Observable<any>>;

export interface IElementRefHook {
  id: string;
  ref: Ref<HTMLElement | undefined>;
}

export type CustomComponentHooks = {
  mounted: FunctionalHook<void, void>;
  reference: DataHook<IElementRefHook>;
};

export type CustomComponentHook =
  CustomComponentHooks[keyof CustomComponentHooks];

const lab = new HooksLab<
  ISetupContext<GenericProps>,
  void,
  CustomComponentHooks
>();

export const onMounted = lab.defineHook('mounted');

const referenceHook = lab.defineHook('reference');

export const useElement = (id: string) => {
  const elRef = ref$<HTMLElement>();
  referenceHook(
    new DataHook<IElementRefHook>({
      id,
      ref: elRef,
    }),
  );
  return elRef;
};
