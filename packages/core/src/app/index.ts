import { DocumentRef } from '@core/render/html/documentRef';
import { container } from '@rexar/di';
import { resolveAplicationRenderer } from '@core/render/html';
import { lastValueFrom } from 'rxjs';
import { Component, TData } from '@core/components/component';
import { ComponentDefinition } from '@core/components/component-definition-builder';

export function createApp<TProps extends TData>(
  root: Component<TProps> | ComponentDefinition<TProps>,
  props?: TProps,
) {
  const rootComponent = root instanceof Component ? root : root.create();
  if (props) {
    rootComponent.bindProps(props);
  }
  const renderer = resolveAplicationRenderer();
  const mount = async (selector: string) => {
    const doc = await lastValueFrom(
      container.resolve<DocumentRef>('DocumentRef').instance$,
    );
    const el = doc.querySelector(selector);
    if (el) {
      await renderer.render(rootComponent, el as HTMLElement);
    }
    return el;
  };
  return {
    mount,
  };
}
