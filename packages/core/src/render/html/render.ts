import { from, map, Observable, switchMap } from 'rxjs';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IBinding } from './@types/binding-target';
// eslint-disable-next-line import/no-cycle
import { resolveRenderer } from './component-renderer-resolver';

export class ComponentRendererHtml extends HtmlRendererBase {
  constructor(private component: AnyComponent) {
    super();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    return from(resolveRenderer(this.component)).pipe(
      map((rf) => rf(this.component)),
      switchMap((c) => {
        c.target$.val = target;
        c.render();
        return c.nextTarget$;
      }),
    );
  }
}

export async function render(component: AnyComponent, target: IBinding) {
  const renderer = new ComponentRendererHtml(component);
  renderer.target$.val = target;
  await renderer.render();
  return renderer;
}
