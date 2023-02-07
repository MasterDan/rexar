import { Component } from '@/components/conmponent';
import { IBinding } from './@types/binding-target';
import { resolveRenderer } from './component-renderer-resolver';

export async function render(component: Component, target: IBinding) {
  const renderFactory = await resolveRenderer(component);
  const renderer = renderFactory(component);
  renderer.renderInto(target);
}
