import { RefStore } from '@core/render/html/ref-store/ref-store';
import { HookPassAny } from '@core/tools/hooks/hooks';
import { filter, map, Observable, Subject } from 'rxjs';

export interface IHookPayload<THookArg, THookParams> {
  trigger$: Subject<THookArg>;
  params: THookParams;
}

export interface IHookHandler {
  register(track$: Observable<HookPassAny>): void;
}

export abstract class HookHandler<THookArg, THookParams>
  implements IHookHandler
{
  abstract readonly hookName: string;

  constructor(protected refStore: RefStore) {}

  abstract handle(
    payload$: Observable<IHookPayload<THookArg, THookParams>>,
  ): void;

  public register(track$: Observable<HookPassAny>): void {
    const payload$ = track$.pipe(
      filter(({ name }) => name === this.hookName),
      map(
        ({ trigger$, params }) =>
          ({ trigger$, params } as IHookPayload<THookArg, THookParams>),
      ),
    );
    this.handle(payload$);
  }
}
