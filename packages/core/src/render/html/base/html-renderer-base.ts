import { ref$ } from '@core/reactivity/ref';
import { Observable, take, lastValueFrom } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

export abstract class HtmlRendererBase implements IHtmlRenderer {
  public target$ = ref$<IBinding>();

  private $component = ref$<AnyComponent>();

  protected get component() {
    if (this.$component.val == null) {
      throw new Error('Component must be set before render');
    }
    return this.$component.val;
  }

  protected get component$() {
    return this.$component.pipe(filter((c): c is AnyComponent => c != null));
  }

  public setComponent(c: AnyComponent) {
    this.$component.val = c;
  }

  public nextTarget$ = ref$<IBinding>();

  abstract renderInto(target: IBinding): Observable<IBinding | undefined>;

  abstract unmount(): Promise<void>;

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
