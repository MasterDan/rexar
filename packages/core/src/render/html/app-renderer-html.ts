import { inject, injectable } from 'tsyringe';
import { AnyComponent } from './@types/any-component';
import { BindingTargetRole } from './@types/binding-target';
import type { IHtmlRenderer } from './@types/IHtmlRenderer';

@injectable()
export class AppRendererHtml {
  constructor(@inject('IHtmlRenderer') private renderer: IHtmlRenderer) {}

  async render(componentRoot: AnyComponent, target: Element) {
    this.renderer.target$.val = {
      parentEl: target,
      target,
      role: BindingTargetRole.Parent,
    };
    this.renderer.setComponent(componentRoot);
    await this.renderer.render();
  }
}
