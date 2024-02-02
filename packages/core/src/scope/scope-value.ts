import type { Component } from '@core/component/component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponentInstance = Component<any>;

export class RenderingScopeValue {
  constructor(public component: AnyComponentInstance) {}
}
