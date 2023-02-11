import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { singleton } from 'tsyringe';
import { AnyComponent } from './@types/any-component';
import { BindingTargetRole } from './@types/binding-target';
import { DocumentRef } from './documentRef';
import { render as renderRoot } from './render';

@singleton()
export class HtmlRenderer {
  constructor(private documnetRef: DocumentRef) {}

  async render(componentRoot: AnyComponent, target: Element) {
    const document = await lastValueFrom(this.documnetRef.instance$);
    const fragment = document.createDocumentFragment();
    await renderRoot(componentRoot, {
      parentEl: target,
      target: fragment,
      role: BindingTargetRole.Parent,
    });
    target.append(fragment);
  }
}
