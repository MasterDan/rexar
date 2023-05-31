import { IDynamicComponentProps } from '@core/components/builtIn/dynamic.component';
import { ref$ } from '@core/reactivity/ref';
import {
  combineLatest,
  from,
  map,
  Observable,
  of,
  pairwise,
  skipUntil,
  switchMap,
  take,
} from 'rxjs';
import { injectable } from 'tsyringe';
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
      map(([component, target]) =>
        component != null && target != null
          ? resolveRenderer(component, target)
          : undefined,
      ),
    ),
  );

  renderInto(): Observable<IBinding | undefined> {
    const renderAsync = async () => {
      if (this.renderer$.value == null) {
        return undefined;
      }
      await this.renderer$.value.render();
      return this.renderer$.value.nextTarget$;
    };

    const firstMount$ = from(renderAsync()).pipe(
      switchMap((i) => (i == null ? of(i) : i)),
      take(1),
    );

    this.renderer$
      .pipe(pairwise(), skipUntil(firstMount$))
      .subscribe(async ([previous, current]) => {
        if (previous) {
          await previous.unmount();
        }
        if (current) {
          await current.render();
          this.nextTarget$.value = current.nextTarget$.value;
        } else {
          this.nextTarget$.value = this.target$.value;
        }
      });

    return firstMount$;
  }

  async unmount(): Promise<void> {
    if (this.renderer$.value) {
      await this.renderer$.value.unmount();
    }
  }
}

