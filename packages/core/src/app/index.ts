import { registerComputedBuilder } from '@core/reactivity/computed/computed-builder';
import { HtmlRenderer } from '@core/render/html';
import { AnyComponent } from '@core/render/html/@types/any-component';
import { DocumentRef } from '@core/render/html/documentRef';
import { container } from 'tsyringe';

export function createApp(root: AnyComponent) {
  registerComputedBuilder();
  const renderer = container.resolve(HtmlRenderer);
  const mount = async (selector: string) => {
    const doc = await container.resolve(DocumentRef).instance$;
    const el = doc.querySelector(selector);
    if (el) {
      await renderer.render(root, el as HTMLElement);
    }
    return el;
  };
  return {
    mount,
  };
}
