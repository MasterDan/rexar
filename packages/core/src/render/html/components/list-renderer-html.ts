import {
  IListComponentProps,
  listComponentName,
} from '@core/components/builtIn/list.component';
import { Component } from '@core/components/conmponent';
import { HtmlRendererBase } from '@core/render/base/html-renderer-base';
import { from, last, map, of, pairwise, startWith, switchMap } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { take } from 'rxjs/internal/operators/take';
import { IBinding } from '../@types/binding-target';
import { ComponentRendererHtml } from '../render';

export class ListRendererHtml extends HtmlRendererBase {
  constructor(private component: Component<IListComponentProps>) {
    super();
    if (component.name !== listComponentName) {
      throw new Error('Must provide list component');
    }
  }

  renderInto(target: IBinding) {
    const content = this.component.getProp('content') ?? [];
    const contentRender$ = from(content).pipe(
      map((c): ComponentRendererHtml => new ComponentRendererHtml(c)),
      startWith(null),
      pairwise(),
    );

    contentRender$.subscribe(([prev, curr]) => {
      if (curr == null) {
        return;
      }
      if (prev == null) {
        curr.target$.val = target;
        curr.render();
      } else {
        prev.nextTarget$.subscribe((at) => {
          curr.target$.val = at;
        });
        curr.target$
          .pipe(
            filter((t) => t != null),
            take(1),
          )
          .subscribe(() => {
            curr.render();
          });
      }
    });
    return contentRender$.pipe(
      last(),
      switchMap(([_, lastRender]) => lastRender?.target$ ?? of(undefined)),
    );
  }
}
