import { from, map, Observable, of, switchMap } from 'rxjs';
import { injectable } from 'tsyringe';
import { HtmlRendererBase } from './base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IBinding } from './@types/binding-target';
import { resolveRenderer } from './component-renderer-resolver';

@injectable()
export class ComponentRendererHtml extends HtmlRendererBase {
  private $component: AnyComponent | undefined;

  setComponent(c: AnyComponent) {
    this.$component = c;
  }

  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!this.$component) {
      return of(undefined);
    }
    return from(resolveRenderer(this.$component)).pipe(
      map((rf) => rf(this.$component as AnyComponent)),
      switchMap((c) => {
        c.target$.val = target;
        c.render();
        return c.nextTarget$;
      }),
    );
  }
}
