import type { Component } from '@core/components/component';
import { RendererFactory } from './RendererFactory';

export interface IComponentRendererResolver {
  resolveRenderer(component: Component): Promise<RendererFactory>;
}
