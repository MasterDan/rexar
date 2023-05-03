import { from, map, Observable, switchMap, tap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { IBinding } from './@types/binding-target';
import type { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { IHtmlRenderer } from './@types/IHtmlRenderer';

@injectable()
export class ComponentRendererHtml extends HtmlRendererBase {
  private renderer: IHtmlRenderer | undefined;

  constructor(
    @inject('IComponentRendererResolver')
    private resolver: IComponentRendererResolver,
  ) {
    super();
  }

  async unmount(): Promise<void> {
    if (this.renderer == null) {
      throw new Error('Cannot unmout component that has not been rendered');
    }
    await this.renderer.unmount();
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    return from(this.resolver.resolveRenderer(this.component)).pipe(
      map((rf) => rf(this.component)),
      tap((r) => {
        this.renderer = r;
      }),
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
