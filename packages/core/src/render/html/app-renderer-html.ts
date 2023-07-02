import { ref$ } from '@rexar/reactivity';
import { AnyComponent } from './@types/any-component';
import { BindingTargetRole } from './@types/binding-target';
import type { IHtmlRenderer } from './@types/IHtmlRenderer';
import { ComponentLifecycle } from './base/lifecycle';

export class AppRendererHtml {
  lifecycle$ = ref$(ComponentLifecycle.Created);

  constructor(private renderer: IHtmlRenderer) {
    this.renderer.subscribeParentLifecycle(this.lifecycle$);
  }

  async render(componentRoot: AnyComponent, target: Element) {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    this.renderer.target$.value = {
      parentEl: target,
      target,
      role: BindingTargetRole.Parent,
    };
    this.renderer.setComponent(componentRoot);
    await this.renderer.render();
    this.lifecycle$.value = ComponentLifecycle.Mounted;
  }
}
