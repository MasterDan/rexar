import { container } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

export const resolveRenderer = (
  component?: AnyComponent,
  target?: IBinding,
): IHtmlRenderer => {
  const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
  if (component) {
    renderer.setComponent(component);
  }
  if (target) {
    renderer.target$.val = target;
  }
  return renderer;
};
