import { AnyComponent } from './@types/any-component';
import { IBinding } from './@types/binding-target';
// eslint-disable-next-line import/no-cycle
import { ComponentRendererHtml } from './component-renderer-html';

export async function render(component: AnyComponent, target: IBinding) {
  const renderer = new ComponentRendererHtml(component);
  renderer.target$.val = target;
  await renderer.render();
  return renderer;
}
