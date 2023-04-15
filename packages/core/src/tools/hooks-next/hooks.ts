import { filter, Subject, takeUntil } from 'rxjs';

export interface IHookPass<T> {
  scope: symbol;
  body: T;
}

const hookTracker = new Subject<IHookPass<unknown>>();

const scopeStack: symbol[] = [];

function beginScope() {
  const scopeId = Symbol('scope');
  scopeStack.push(scopeId);
  const destroyScope$ = new Subject<void>();
  const end = () => {
    destroyScope$.next();
    destroyScope$.complete();
    scopeStack.pop();
  };
  const track$ = hookTracker.pipe(
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

export function defineHook<THook>(
  arg: (track: (hook: THook) => void) => THook,
): THook {
  const track = (hook: THook) => {
    hookTracker.next({
      body: hook,
      scope: getCurrent(),
    });
  };
  return arg(track);
}
