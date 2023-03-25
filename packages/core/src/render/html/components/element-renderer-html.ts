import { listComponent } from '@core/components/builtIn/list.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { DocumentRef } from '../documentRef';
import { RefStore } from '../ref-store/ref-store';

@injectable()
export class ElementRendererHtml extends HtmlRendererBase {
  constructor(private refStore: RefStore) {
    super();
  }

  renderInto(binding: IBinding) {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('Element must have name');
    }
    const attrs = this.component.getProp('attrs') ?? {};
    const children = this.component.getProp('children') ?? [];
    const renderEleMent = async (doc: Document) => {
      const el = doc.createElement(name);
      Object.keys(attrs).forEach((k) => {
        el.setAttribute(k, attrs[k]);
      });
      if (children.length > 0) {
        const list = listComponent.create();
        list.bindProp('content', children);
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(list);
        renderer.target$.val = {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        };
        await renderer.render();
      }
      switch (binding.role) {
        case BindingTargetRole.Parent:
          binding.target.prepend(el);
          break;
        case BindingTargetRole.PreviousSibling:
          binding.parentEl.insertBefore(el, binding.target.nextSibling);
          break;
        default:
          break;
      }
      // console.log(el.outerHTML);

      return {
        parentEl: binding.parentEl,
        role: BindingTargetRole.PreviousSibling,
        target: el,
      };
    };
    return container
      .resolve(DocumentRef)
      .instance$.pipe(switchMap((d) => from(renderEleMent(d))));
  }
}
