import type { Component } from '@core/components/conmponent';
import { RendererFactory } from './RendererFactory';

export interface IComponentRendererResolver {
  resolveRenderer(component: Component): Promise<RendererFactory>;
}
