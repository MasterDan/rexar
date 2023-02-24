import { ref$ } from '@core/reactivity/ref';
import { Observable, take, lastValueFrom } from 'rxjs';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

export abstract class HtmlRendererBase implements IHtmlRenderer {
  public target$ = ref$<IBinding>();

  private $component: AnyComponent | undefined;

  protected get component() {
    if (this.$component == null) {
      throw new Error('Component must be set before render');
    }
    return this.$component;
  }

  public setComponent(c: AnyComponent) {
    this.$component = c;
  }

  public nextTarget$ = ref$<IBinding>();

  abstract renderInto(target: IBinding): Observable<IBinding | undefined>;

  public async render() {
    if (this.target$.val == null) {
      return;
    }
    const nextTarget = await lastValueFrom(
      this.renderInto(this.target$.val).pipe(take(1)),
    );
    this.nextTarget$.val = nextTarget ?? this.target$.val;
  }
}
