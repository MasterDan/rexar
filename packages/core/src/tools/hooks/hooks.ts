import { AnyRecord } from '@core/@types/AnyRecord';
import { filter, Observable, Subject, takeUntil } from 'rxjs';

export interface IHookPass<T = void> {
  scope: symbol;
  name: string;
  params: AnyRecord<string>;
  trigger$: Subject<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookPassAny = IHookPass<any>;

const hookTracker$ = new Subject<HookPassAny>();

let scopeStack: symbol[] = [];

function beginScope() {
  const scopeId = Symbol('scope');
  scopeStack.push(scopeId);
  const destroyScope$ = new Subject<void>();
  const end = () => {
    destroyScope$.next();
    destroyScope$.complete();
    scopeStack = scopeStack.filter((x) => x !== scopeId);
  };
  const track$ = hookTracker$.pipe(
    takeUntil(destroyScope$),
    filter(({ scope }) => scope === scopeId),
  );
  return { id: scopeId, track$, end };
}

function getCurrent() {
  if (scopeStack.length === 0) {
    throw new Error('Scope is empty!');
  }
  return scopeStack[scopeStack.length - 1];
}

export const hookScope = {
  beginScope,
  getCurrent,
};

const hookNames: Record<string, boolean> = {};

export function defineHook<
  TArg = void,
  TParams extends AnyRecord<string> = AnyRecord<string>,
>(name: string) {
  if (hookNames[name]) {
    throw new Error(`Hook wth name "${name}" already exists`);
  }
  hookNames[name] = true;
  return (hook: (value: TArg) => void, params: Partial<TParams> = {}) => {
    const trigger$ = new Subject<TArg>();
    hookTracker$.next({
      name,
      trigger$,
      scope: getCurrent(),
      params,
    });
    trigger$.subscribe(hook);
  };
}

export function catchHooks(
  tracker$: Observable<HookPassAny>,
  ...names: string[]
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store: Record<string, Subject<any>[] | undefined> = {};
  tracker$
    .pipe(
      filter(({ name }) =>
        names.length === 0 ? true : names.some((n) => n === name),
      ),
    )
    .subscribe(({ name, trigger$ }) => {
      const triggers = store[name];
      if (triggers) {
        triggers.push(trigger$);
      } else {
        store[name] = [trigger$];
      }
    });
  const trigger = <T>(name: string, value: T | undefined = undefined) => {
    const triggers = store[name];
    if (triggers) {
      triggers.forEach((t) => {
        t.next(value);
      });
    }
  };
  return { hooks: store, trigger };
}
