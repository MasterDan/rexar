import type { Component } from '@core/component/component';
import { RenderContext } from './context';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponentInstance = Component<any>;

export class RenderingScopeValue {
  constructor(
    public component: AnyComponentInstance,
    public context: RenderContext,
  ) {}
}
