import { ElementTransformer } from '@core/render/html/ref-store/element.transformer';
import { defineHook } from '@core/tools/hooks/hooks';
import { BuiltInHooks } from './@types/built-in-hooks';

export interface ITransformHookParams {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const transformHook = defineHook<ElementTransformer, ITransformHookParams>(
  BuiltInHooks.Transform,
);
