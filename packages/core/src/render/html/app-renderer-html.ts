import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { inject, injectable } from 'tsyringe';
import { AnyComponent } from './@types/any-component';
import { BindingTargetRole } from './@types/binding-target';
import { IHtmlRenderer } from './@types/IHtmlRenderer';
import { DocumentRef } from './documentRef';

@injectable()
export class AppRendererHtml {
  constructor(
    private documnetRef: DocumentRef,
    @inject('IHtmlRenderer') private renderer: IHtmlRenderer,
  ) {}

  async render(componentRoot: AnyComponent, target: Element) {
    const document = await lastValueFrom(this.documnetRef.instance$);
    const fragment = document.createDocumentFragment();
    this.renderer.target$.val = {
      parentEl: target,
      target: fragment,
      role: BindingTargetRole.Parent,
    };
    this.renderer.setComponent(componentRoot);
    await this.renderer.render();

    target.append(fragment);
  }
}
