import { list } from '@core/components/builtIn/list.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import {
  htmlElementDefinitionName,
  IElementComponentProps,
} from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/component';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { DocumentRef } from '../documentRef';
import { RefStore } from '../ref-store/ref-store';
import { ElementReference } from '../ref-store/element.reference';

@injectable()
export class ElementRendererHtml extends HtmlRendererBase {
  el: HTMLElement | undefined;

  constructor(private refStore: RefStore) {
    super();
  }

  get elComponent(): Component<IElementComponentProps> {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('Element must have name');
    }
    if (this.component.name !== htmlElementDefinitionName) {
      throw new Error('Component must render single element');
    }
    return this.component;
  }

  unmount(): Promise<void> {
    if (this.el == null) {
      throw new Error('NothingToUnmount');
    }
    if (this.target$.val == null) {
      throw new Error('Target not exists');
    }
    this.el.remove();
    this.nextTarget$.val = this.target$.val;
    return Promise.resolve();
  }

  renderInto(binding: IBinding) {
    const name = this.elComponent.getProp('name');
    const attrs = this.elComponent.getProp('attrs') ?? {};
    const children = this.elComponent.getProp('children') ?? [];
    const renderEleMent = async (doc: Document) => {
      const el = doc.createElement(name);
      this.el = el;
      Object.keys(attrs).forEach((k) => {
        el.setAttribute(k, attrs[k] ?? '');
      });
      if (children.length > 0) {
        const listComp = list(children);
        listComp.bindProp('content', children);
        const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
        renderer.setComponent(listComp);
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
      if (this.elComponent.id) {
        const ref = new ElementReference();
        ref.el.val = el;
        const { reference } = this.refStore.getReferences(this.elComponent.id);
        reference.el.val = el;
        reference.component.val = this.elComponent;
      }
      console.log(binding.parentEl.outerHTML);

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
