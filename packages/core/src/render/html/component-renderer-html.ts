import { from, map, Observable, switchMap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { IBinding } from './@types/binding-target';
import type { IComponentRendererResolver } from './@types/IComponentRendererResolver';

@injectable()
export class ComponentRendererHtml extends HtmlRendererBase {
  constructor(
    @inject('IComponentRendererResolver')
    private resolver: IComponentRendererResolver,
  ) {
    super();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    return from(this.resolver.resolveRenderer(this.component)).pipe(
      map((rf) => rf(this.component)),
      switchMap((renderer) => {
        const renderComponent = async () => {
          renderer.setComponent(this.component);
          renderer.target$.val = target;
          await renderer.render();
          return renderer.nextTarget$;
        };
        return from(renderComponent()).pipe(map((ref) => ref.val));
      }),
    );
  }
}
