import { AnyComponent } from '@core/render/html/@types/any-component';
import { DocumentRef } from '@core/render/html/documentRef';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { container } from 'tsyringe';
import { getAppRenderer } from '@core/render/html';

export function createApp(root: AnyComponent) {
  const renderer = getAppRenderer();
  const mount = async (selector: string) => {
    const doc = await lastValueFrom(container.resolve(DocumentRef).instance$);
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
