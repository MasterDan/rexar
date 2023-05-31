import { Component, TData } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { Observable, take, lastValueFrom, filter, combineLatest } from 'rxjs';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { ComponentLifecycle } from './lifecycle';

export abstract class HtmlRendererBase<TProps extends TData = TData>
  implements IHtmlRenderer
{
  constructor() {
    combineLatest([this.selfLifecycle$, this.parentLifecycle]).subscribe(
      ([selfLife, parentLife]) => {
        if (
          parentLife === ComponentLifecycle.Mounted &&
          selfLife === ComponentLifecycle.Rendered
        ) {
          this.selfLifecycle$.value = ComponentLifecycle.Mounted;
        }

        if (parentLife === ComponentLifecycle.BeforeUnmount) {
          this.selfLifecycle$.value = parentLife;
        }
      },
    );
  }

  public target$ = ref$<IBinding>();

  private $component = ref$<Component<TProps>>();

  protected get component() {
    if (this.$component.value == null) {
      throw new Error('Component must be set before render');
    }
    return this.$component.value;
  }

  protected get component$() {
    return this.$component.pipe(
      filter((c): c is Component<TProps> => c != null),
    );
  }

  public setComponent(c: AnyComponent) {
    this.$component.value = c;
  }

  public nextTarget$ = ref$<IBinding>();

  abstract renderInto(target: IBinding): Observable<IBinding | undefined>;

  abstract unmount(): Promise<void>;

  public async render() {
    if (this.target$.value == null) {
      return;
    }
    const nextTarget = await lastValueFrom(
      this.renderInto(this.target$.value).pipe(take(1)),
    );
    this.nextTarget$.value = nextTarget ?? this.target$.value;
  }

  protected selfLifecycle$ = ref$(ComponentLifecycle.Created);

  protected parentLifecycle = ref$(ComponentLifecycle.Created);

  public lifecycle$ = ref$(
    () =>
      Math.min(
        this.selfLifecycle$.value,
        this.parentLifecycle.value,
      ) as ComponentLifecycle,
    (val) => {
      this.selfLifecycle$.value = val;
    },
  );

  public subscribeParentLifecycle(life: Observable<ComponentLifecycle>) {
    life.subscribe((lval) => {
      this.parentLifecycle.value = lval;
    });
  }
}

