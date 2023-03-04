import { ElementReference } from '@core/render/html/ref-store/element.reference';
import { HooksLab } from '@core/tools/hooks';
import { Observable } from 'rxjs';
import { ISetupContext } from './custom-template-component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericProps = Record<string, Observable<any>>;

export type CustomComponentHooks = {
  mounted: () => void;
  element: (elementRef: ElementReference) => void;
};

export type CustomComponentHook =
  CustomComponentHooks[keyof CustomComponentHooks];

const lab = new HooksLab<
  ISetupContext<GenericProps>,
  void,
  CustomComponentHooks
>();

export const onMounted = lab.defineHook('mounted');
