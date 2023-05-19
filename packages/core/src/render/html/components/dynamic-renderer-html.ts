import { IDynamicComponentProps } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@core/reactivity/ref';
import {
  combineLatest,
  filter,
  from,
  map,
  Observable,
  of,
  pairwise,
  skipUntil,
  startWith,
  switchMap,
  take,
} from 'rxjs';
import { injectable } from 'tsyringe';
import { AnyComponent } from '../@types/any-component';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { resolveRenderer } from '../tools';

@injectable()
export class DynamicRendererHtml extends HtmlRendererBase<IDynamicComponentProps> {
  renderer$ = ref$(
    combineLatest([
      this.component$.pipe(switchMap((c) => c.getProp('component$'))),
      this.target$,
    ]).pipe(
      filter((arr): arr is [AnyComponent, IBinding] => {
        const [component, target] = arr;
        return component != null && target != null;
      }),
      map(([component, target]) => resolveRenderer(component, target)),
    ),
  );

  renderInto(): Observable<IBinding | undefined> {
    const renderAsync = async () => {
      if (this.renderer$.val == null) {
        return undefined;
      }
      await this.renderer$.val.render();
      return this.renderer$.val.nextTarget$;
    };

    const firstMount$ = from(renderAsync()).pipe(
      take(1),
      switchMap((i) => (i == null ? of(i) : i)),
      take(1),
    );

    this.renderer$
      .pipe(skipUntil(firstMount$), startWith(undefined), pairwise())
      .subscribe(async ([previous, current]) => {
        if (previous) {
          await previous.unmount();
        }
        if (current) {
          await current.render();
        }
      });

    return firstMount$;
  }

  async unmount(): Promise<void> {
    if (this.renderer$.val) {
      await this.renderer$.val.unmount();
    }
  }
}
