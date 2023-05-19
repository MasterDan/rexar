import { IConditionalComponentProps } from '@core/components/builtIn/conditional.component';
import { ref$ } from '@core/reactivity/ref';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { skipUntil } from 'rxjs/internal/operators/skipUntil';
import { injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';
import { resolveRenderer } from '../tools';

@injectable()
export class ConditionalRendererHtml extends HtmlRendererBase<IConditionalComponentProps> {
  condition$ = ref$(this.component$.pipe(map((c) => c?.getProp('if$'))));

  positiveRenderer$ = ref$(
    combineLatest([
      this.component$.pipe(map((c) => c?.getProp('ifTrue$'))),
      this.target$,
    ]).pipe(
      map(([c, t]) => {
        if (c == null || c.val == null || t == null) {
          return undefined;
        }
        return resolveRenderer(c.val, t);
      }),
    ),
  );

  negativeRenderer$ = ref$(
    combineLatest([
      this.component$.pipe(map((c) => c?.getProp('ifFalse$'))),
      this.target$,
    ]).pipe(
      map(([c, t]) => {
        if (c == null || c.val == null || t == null) {
          return undefined;
        }
        return resolveRenderer(c.val, t);
      }),
    ),
  );

  renderInto(): Observable<IBinding | undefined> {
    const condition$ = this.component.getProp('if$');

    const firstMount$ = condition$.pipe(
      switchMap((c) => (c ? this.positiveRenderer$ : this.negativeRenderer$)),
      switchMap((r) => {
        if (r == null) {
          return of(undefined);
        }
        const renderAsync = async () => {
          await r.render();
          return r.nextTarget$;
        };
        return from(renderAsync());
      }),
      switchMap((v) => (v == null ? of(undefined) : v)),
      take(1),
    );

    condition$.pipe(skipUntil(firstMount$)).subscribe(async (condition) => {
      const negative = this.negativeRenderer$.val;
      const positive = this.positiveRenderer$.val;
      if (condition) {
        if (negative) {
          await negative.unmount();
        }
        if (positive) {
          await positive.render();
        }
      } else {
        if (positive) {
          await positive.unmount();
        }
        if (negative) {
          await negative.render();
        }
      }
    });

    return firstMount$;
  }

  async unmount(): Promise<void> {
    if (this.condition$.val == null) {
      return;
    }
    if (this.condition$.val && this.positiveRenderer$.val) {
      await this.positiveRenderer$.val.unmount();
    }
    if (!this.condition$.val && this.negativeRenderer$.val) {
      await this.negativeRenderer$.val.unmount();
    }
  }
}
