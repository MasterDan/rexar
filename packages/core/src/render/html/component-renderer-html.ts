import { from, map, Observable, switchMap, tap } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { IBinding } from './@types/binding-target';
import type { IComponentRendererResolver } from './@types/IComponentRendererResolver';
import { IHtmlRenderer } from './@types/IHtmlRenderer';
import { ComponentLifecycle } from './base/lifecycle';

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
    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    await this.renderer.unmount();
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    return from(this.resolver.resolveRenderer(this.component)).pipe(
      map((rf) => rf(this.component)),
      tap((r) => {
        this.renderer = r;
        this.renderer.subscribeParentLifecycle(this.lifecycle$);
      }),
      switchMap((renderer) => {
        const renderComponent = async () => {
          this.lifecycle$.value = ComponentLifecycle.BeforeRender;
          renderer.setComponent(this.component);
          renderer.target$.value = target;
          await renderer.render();
          this.lifecycle$.value = ComponentLifecycle.Rendered;
          return renderer.nextTarget$;
        };
        return from(renderComponent()).pipe(switchMap((ref) => ref));
      }),
    );
  }
}

