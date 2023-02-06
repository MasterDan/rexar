import {
  htmlElementDefinitionName,
  IElementComponentProps,
} from '@/components/builtIn/html-element.component';
import { Component } from '@/components/conmponent';
import { container } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

export class ElementRendererHtml {
  constructor(private component: Component<IElementComponentProps>) {
    if (component.name !== htmlElementDefinitionName) {
      throw new Error('Not Html element!');
    }
  }

  async renderInto(binding: IBinding): Promise<IBinding> {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('Element must have name');
    }
    const attrs = this.component.getProp('attrs') ?? {};
    const docRef = container.resolve(DocumentRef);
    const document = await docRef.instance;
    const el = document.createElement(name);
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
  }
}
