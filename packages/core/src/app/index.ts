import { AnyComponent } from '@core/render/html/@types/any-component';
import { DocumentRef } from '@core/render/html/documentRef';
import { container } from 'tsyringe';
import { getAppRenderer } from '@core/render/html';
import { lastValueFrom } from 'rxjs';
import { AnyComponentDefinition } from '@core/components';
import { Component } from '@core/components/component';

export function createApp(root: AnyComponent | AnyComponentDefinition) {
  const rootComponent = root instanceof Component ? root : root.create();
  const renderer = getAppRenderer();
  const mount = async (selector: string) => {
    const doc = await lastValueFrom(container.resolve(DocumentRef).instance$);
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
