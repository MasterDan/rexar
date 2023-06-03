import { IArrayItemProps } from '@core/components/builtIn/custom/hooks/pick-template.hook';
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
  skipUntil,
  startWith,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { ComponentLifecycle } from '../base/lifecycle';
import { resolveRenderer } from '../tools';

interface IRendererWithCommand {
  renderer: IHtmlRenderer;
  command: 'mount' | 'unmount' | 'skip';
}

@injectable()
export class ListRendererHtml extends HtmlRendererBase<IListComponentProps> {
  private listContent$ = ref$<AnyComponent[]>();

  private listRenderers$ = ref$<IRendererWithCommand[]>();

  private unsub$ = new Subject<void>();

  constructor() {
    super();
    const isArray = this.component.getProp('isArray');
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
      .pipe(
        filter((x): x is AnyComponent[] => x != null),
        startWith(undefined),
        pairwise(),
        filter(
          (arr): arr is [AnyComponent[] | undefined, AnyComponent[]] =>
            arr[1] != null,
        ),
      )
      .subscribe(([prev, curr]) => {
        if (!isArray || prev == null) {
          this.listRenderers$.value = curr.map((i) => {
            const renderer = resolveRenderer(i);
            renderer.subscribeParentLifecycle(this.lifecycle$);
            return { renderer, command: 'mount' };
          });
        } else {
          const oldRenderers = (this.listRenderers$.value ?? []).filter(
            (r) => r.command !== 'unmount',
          );
          const renderers: IRendererWithCommand[] = [];
          const actualizeProps = (maxIndex: number) => {
            for (let i = 0; i < maxIndex; i += 1) {
              const current = curr[i] as Component<IArrayItemProps<unknown>>;
              const previous = prev[i] as Component<IArrayItemProps<unknown>>;
              if (
                current.getProp('item').value?.key !==
                previous.getProp('item').value?.key
              ) {
                oldRenderers[i].renderer.component.bindProp(
                  'item',
                  current.getProp('item'),
                );
              }
              renderers.push({
                renderer: oldRenderers[i].renderer,
                command: 'skip',
              });
            }
          };
          const addNew = (start: number, stop: number) => {
            for (let i = start; i < stop; i += 1) {
              const current = curr[i];
              const renderer = resolveRenderer(current);
              renderer.subscribeParentLifecycle(this.lifecycle$);
              renderers.push({ renderer, command: 'mount' });
            }
          };
          const removeOld = (start: number, stop: number) => {
            for (let i = start; i < stop; i += 1) {
              renderers.push({
                renderer: oldRenderers[i].renderer,
                command: 'unmount',
              });
            }
          };

          if (curr.length === prev.length) {
            actualizeProps(curr.length - 1);
          }

          if (curr.length < prev.length) {
            actualizeProps(curr.length - 1);
            removeOld(curr.length, prev.length - 1);
          }
          if (curr.length > prev.length) {
            actualizeProps(prev.length - 1);
            addNew(prev.length, curr.length - 1);
          }
          this.listRenderers$.value = renderers;
        }
      });
    // linking targets
    this.listRenderers$
      .pipe(
        filter((x): x is IRendererWithCommand[] => x != null),
        tap(() => this.unsub$.next()),
        map((x) => x.map((i) => i.renderer)),
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
    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    // eslint-disable-next-line no-restricted-syntax
    for (const renderer of this.listRenderers$.value) {
      // eslint-disable-next-line no-await-in-loop
      await renderer.renderer.unmount();
    }
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
  }

  renderInto(target: IBinding) {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    const renderContent = async () => {
      const renderers = this.listRenderers$.value;
      if (renderers == null) {
        throw new Error('List renderers were not created');
      }
      let lastTarget: IBinding | undefined;
      // eslint-disable-next-line no-restricted-syntax
      for (const { renderer } of renderers.filter(
        (r) => r.command === 'mount',
      )) {
        if (renderer.target$.value == null) {
          renderer.target$.value = target;
        }
        // eslint-disable-next-line no-await-in-loop
        await renderer.render();

        lastTarget = renderer.nextTarget$.value;
      }
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return lastTarget;
    };

    const firstMount$ = from(renderContent());
    this.listRenderers$
      .pipe(
        skipUntil(firstMount$),
        filter((v): v is IRendererWithCommand[] => v != null),
      )
      .subscribe(async (renderers) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const { command, renderer } of renderers) {
          if (command === 'mount') {
            if (renderer.target$.value == null) {
              renderer.target$.value = target;
            }
            // eslint-disable-next-line no-await-in-loop
            await renderer.render();
          }
          if (command === 'unmount') {
            // eslint-disable-next-line no-await-in-loop
            await renderer.unmount();
          }
        }
      });

    return firstMount$;
  }
}

