import {
  IListComponentProps,
  listComponentName,
} from '@core/components/builtIn/list.component';
import {
  ITextComponentProps,
  textComponentName,
} from '@core/components/builtIn/text.component';
import { Component } from '@core/components/component';
import { ref$ } from '@core/reactivity/ref';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from, map, mergeMap, pairwise, Subject, takeUntil, tap } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { container, injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

@injectable()
export class ListRendererHtml extends HtmlRendererBase {
  private listContent$ = ref$<AnyComponent[]>();

  private listRenderers$ = ref$<IHtmlRenderer[]>();

  constructor() {
    super();
    this.component$
      .pipe(
        filter(
          (c): c is Component<IListComponentProps> =>
            c.name === listComponentName,
        ),
        mergeMap((c) => c.getProp('content')),
        map((content) =>
          content.map((c, i, a) => {
            if (c.name === textComponentName && i < a.length - 1) {
              (c as Component<ITextComponentProps>).bindProp(
                'trailingTemplate',
                true,
              );
            }
            return c;
          }),
        ),
      )
      .subscribe((content) => {
        this.listContent$.val = content;
      });
    this.listContent$
      .pipe(filter((x): x is AnyComponent[] => x != null))
      .subscribe((content) => {
        this.listRenderers$.val = content.map((i) => {
          const renderer = container.resolve<IHtmlRenderer>('IHtmlRenderer');
          renderer.setComponent(i);
          return renderer;
        });
      });
    const unsub$ = new Subject<void>();
    this.listRenderers$
      .pipe(
        filter((x): x is IHtmlRenderer[] => x != null),
        tap(() => unsub$.next()),
        mergeMap((x) => from(x)),
        pairwise(),
        mergeMap(([curr, next]) =>
          curr.nextTarget$.pipe(
            takeUntil(unsub$),
            filter((t): t is IBinding => t != null),
            map((t) => ({ currNext: t, next: next.target$ })),
          ),
        ),
      )
      .subscribe(({ next, currNext }) => {
        next.val = currNext;
      });
  }

  get listComponent(): Component<IListComponentProps> {
    if (this.component.name !== listComponentName) {
      throw new Error('Component must render list of components');
    }
    return this.component;
  }

  async unmount(): Promise<void> {
    if (this.listRenderers$.val == null) {
      throw new Error('Cannot remove non exisiting list');
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const renderer of this.listRenderers$.val) {
      // eslint-disable-next-line no-await-in-loop
      await renderer.unmount();
    }
  }

  renderInto(target: IBinding) {
    const renderContent = async () => {
      const renderers = this.listRenderers$.val;
      if (renderers == null) {
        throw new Error('List renderers were not created');
      }
      let lastTarget: IBinding | undefined;
      // eslint-disable-next-line no-restricted-syntax
      for (const renderer of renderers) {
        if (renderer.target$.val == null) {
          renderer.target$.val = target;
        }
        // eslint-disable-next-line no-await-in-loop
        await renderer.render();
        lastTarget = renderer.nextTarget$.val;
      }

      return lastTarget;
    };
    return from(renderContent());
  }
}
