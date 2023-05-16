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
import { container, injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

let index = 1;

@injectable()
export class ListRendererHtml extends HtmlRendererBase {
  private listContent$ = ref$<AnyComponent[]>();

  private listRenderers$ = ref$<IHtmlRenderer[]>();

  // eslint-disable-next-line no-plusplus
  private index = index++;

  private unsub$ = new Subject<void>();

  constructor() {
    super();
    // this.unsub$.subscribe(() => {
    //   console.log(`unsub triggered in renderer ${this.index}`);
    // });
    this.component$
      .pipe(
        filter(
          (c): c is Component<IListComponentProps> =>
            c.type === ComponentType.List,
        ),
        mergeMap((c) => c.getProp('content')),
        map((content) =>
          content.map((c, i, a) => {
            if (c.type === ComponentType.Text && i < a.length - 1) {
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
        // console.log(
        //   `new content (len: ${content.length}) In list ${this.index}`,
        // );

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
    this.listRenderers$
      .pipe(
        filter((x): x is IHtmlRenderer[] => x != null),
        // tap((x) => {
        //   console.log(
        //     `renderers  (len: ${x.length}) updated In list ${this.index}`,
        //   );
        // }),
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
        next.val = currNext;
        // console.log(
        //   'setting target',
        //   this.listRenderers$.val?.map((i) => i.target$.val ?? null),
        // );
      });
  }

  get listComponent(): Component<IListComponentProps> {
    if (this.component.type !== ComponentType.List) {
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
          // console.log(
          //   'target is null -> setting parent',
          //   this.listRenderers$.val?.map((i) => i.target$.val ?? null),
          // );
        }
        // eslint-disable-next-line no-await-in-loop
        await renderer.render();
        // console.log('componet rendered');

        lastTarget = renderer.nextTarget$.val;
      }

      return lastTarget;
    };
    return from(renderContent());
  }
}
