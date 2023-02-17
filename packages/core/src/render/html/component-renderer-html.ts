import { from, map, Observable, switchMap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { IBinding } from './@types/binding-target';
import { IComponentRendererResolver } from './@types/IComponentRendererResolver';

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
      switchMap((c) => {
        c.setComponent(this.component);
        c.target$.val = target;
        c.render();
        return c.nextTarget$;
      }),
    );
  }
}
