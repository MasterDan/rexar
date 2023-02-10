import {
  htmlElementDefinitionName,
  IElementComponentProps,
} from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/conmponent';
import { HtmlRendererBase } from '@core/render/base/html-renderer-base';
import { map } from 'rxjs';
import { container } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

export class ElementRendererHtml extends HtmlRendererBase {
  constructor(private component: Component<IElementComponentProps>) {
    super();
    if (component.name !== htmlElementDefinitionName) {
      throw new Error('Not Html element!');
    }
  }

  renderInto(binding: IBinding) {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('Element must have name');
    }
    const attrs = this.component.getProp('attrs') ?? {};
    const docRef = container.resolve(DocumentRef);
    return docRef.instance$.pipe(
      map((doc) => {
        const el = doc.createElement(name);
        Object.keys(attrs).forEach((k) => {
          el.setAttribute(k, attrs[k]);
        });
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
        return {
          parentEl: binding.parentEl,
          role: BindingTargetRole.PreviousSibling,
          target: el,
        };
      }),
    );
  }
}
