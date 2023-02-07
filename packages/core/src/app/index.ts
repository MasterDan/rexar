import { Component } from '@/components/conmponent';
import { registerComputedBuilder } from '@/reactivity/computed/computed-builder';
import { HtmlRenderer } from '@/render/html';
import { DocumentRef } from '@/render/html/documentRef';
import { container } from 'tsyringe';

export function createApp(root: Component) {
  registerComputedBuilder();
  const renderer = container.resolve(HtmlRenderer);
  const mount = (selector: string) => {
    container.resolve(DocumentRef).instance.then((doc) => {
      const el = doc.querySelector(selector);
      if (el) {
        renderer.render(root, el as HTMLElement);
      }
    });
  };
  return {
    mount,
  };
}
