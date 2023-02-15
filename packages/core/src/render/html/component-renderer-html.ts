import { from, map, Observable, switchMap } from 'rxjs';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { AnyComponent } from './@types/any-component';
import { IBinding } from './@types/binding-target';
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
