import { IListComponentProps } from '@core/components/builtIn/list.component';
import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { ref$ } from '@core/reactivity/ref';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import {
  filter,
  from,
  map,
  mergeMap,
  pairwise,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { resolveRenderer } from '../tools';

@injectable()
export class ListRendererHtml extends HtmlRendererBase<IListComponentProps> {
  private listContent$ = ref$<AnyComponent[]>();

  private listRenderers$ = ref$<IHtmlRenderer[]>();

  private unsub$ = new Subject<void>();

  constructor() {
    super();
    this.component$
      .pipe(
        filter((c) => c.type === ComponentType.List),
        mergeMap((c) => c.getProp('content')),
        map((content) =>
          content.map((c, i, a) => {
            if (c.type === ComponentType.Text && i < a.length - 1) {
              (c as Component<ITextComponentProps>).bindProp(
                'trailingComment',
                true,
              );
            }
            return c;
          }),
        ),
      )
      .subscribe((content) => {
        this.listContent$.value = content;
      });
    this.listContent$
      .pipe(filter((x): x is AnyComponent[] => x != null))
      .subscribe((content) => {
        this.listRenderers$.value = content.map((i) => resolveRenderer(i));
      });
    // linking targets
    this.listRenderers$
      .pipe(
        filter((x): x is IHtmlRenderer[] => x != null),
        tap(() => this.unsub$.next()),
        mergeMap((x) => from(x)),
        pairwise(),
        mergeMap(([curr, next]) =>
          curr.nextTarget$.pipe(
            takeUntil(this.unsub$),
            filter((t): t is IBinding => t != null),
            map((t) => ({ currNext: t, next: next.target$ })),
          ),
        ),
      )
      .subscribe(({ next, currNext }) => {
        next.value = currNext;
      });
  }

  async unmount(): Promise<void> {
    if (this.listRenderers$.value == null) {
      throw new Error('Cannot remove non exisiting list');
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const renderer of this.listRenderers$.value) {
      // eslint-disable-next-line no-await-in-loop
      await renderer.unmount();
    }
  }

  renderInto(target: IBinding) {
    const renderContent = async () => {
      const renderers = this.listRenderers$.value;
      if (renderers == null) {
        throw new Error('List renderers were not created');
      }
      let lastTarget: IBinding | undefined;
      // eslint-disable-next-line no-restricted-syntax
      for (const renderer of renderers) {
        if (renderer.target$.value == null) {
          renderer.target$.value = target;
        }
        // eslint-disable-next-line no-await-in-loop
        await renderer.render();

        lastTarget = renderer.nextTarget$.value;
      }

      return lastTarget;
    };
    return from(renderContent());
  }
}

