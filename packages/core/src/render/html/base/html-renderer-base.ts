import { Component, TData } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { Observable, take, lastValueFrom, filter } from 'rxjs';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { ComponentLifecycle } from './lifecycle';

export abstract class HtmlRendererBase<TProps extends TData = TData>
  implements IHtmlRenderer
{
  public target$ = ref$<IBinding>();

  private $component = ref$<Component<TProps>>();

  protected get component() {
    if (this.$component.val == null) {
      throw new Error('Component must be set before render');
    }
    return this.$component.val;
  }

  protected get component$() {
    return this.$component.pipe(
      filter((c): c is Component<TProps> => c != null),
    );
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

  protected lifecycle$ = ref$(ComponentLifecycle.Created);

  protected parentLifecycle = ref$(ComponentLifecycle.Created);

  public subscribeParentLifecycle(life: Observable<ComponentLifecycle>) {
    life.subscribe((lval) => {
      this.parentLifecycle.val = lval;
    });
  }
}

