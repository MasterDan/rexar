import { Component } from '@core/components/conmponent';
import { registerComputedBuilder } from '@core/reactivity/computed/computed-builder';
import { HtmlRenderer } from '@core/render/html';
import { DocumentRef } from '@core/render/html/documentRef';
import { container } from 'tsyringe';

export function createApp(root: Component) {
  console.log('creating app...');

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
