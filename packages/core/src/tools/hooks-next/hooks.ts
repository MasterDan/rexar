import { filter, Subject, takeUntil } from 'rxjs';

export interface IHookPass<T = void> {
  scope: symbol;
  name: string;
  trigger$: Subject<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hookTracker$ = new Subject<IHookPass<any>>();

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

const hookNames: string[] = [];

export function defineHook<T = void>(name: string) {
  if (hookNames.some((x) => x === name)) {
    throw new Error(`Hook wth name "${name}" already exists`);
  }
  return (hook: (value: T) => void) => {
    const trigger$ = new Subject<T>();
    hookTracker$.next({
      name,
      trigger$,
      scope: getCurrent(),
    });
    trigger$.subscribe(hook);
  };
}
