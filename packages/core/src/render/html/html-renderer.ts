import { Component } from '@/components/conmponent';
import { BindingTargetRole } from './@types/binding-target';
import { DocumentRef } from './documentRef';
import { render as renderRoot } from './render';

export class HtmlRenderer {
  constructor(private documnetRef: DocumentRef) {}

  async render(componentRoot: Component, target: HTMLElement) {
    const document = await this.documnetRef.instance;
    const fragment = document.createDocumentFragment();
    renderRoot(componentRoot, {
      parentEl: target,
      target: fragment,
      role: BindingTargetRole.Parent,
    });
  }
}
