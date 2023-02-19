import { Subject } from 'rxjs';

type Fn<TArgs, TResult> = (context: TArgs) => TResult;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = Fn<any, any>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HookFn<TArgs> = Fn<TArgs, any>;

interface IHookTrack {
  name: symbol;
  fn: AnyFn;
}

const binder$ = new Subject<IHookTrack>();

export function defineHook<TContext, TResult = void, TGlobalContext = TContext>(
  name: string,
  extractContext: Fn<TGlobalContext, TContext>,
): (fn: Fn<TContext, TResult>) => void {
  const hookId = Symbol.for(name);
  return (fn: Fn<TContext, TResult>) => {
    binder$.next({
      name: hookId,
      fn: (context: TGlobalContext) => fn(extractContext(context)),
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HooksDefinition = Record<string, any>;

export function defineHookable<
  TContext,
  TResult = void,
  THooks extends HooksDefinition = HooksDefinition,
>(
  execFunc: (
    fn: Fn<TContext, TResult>,
    hook: <TKey extends keyof THooks>(
      hookName: TKey,
      context: TContext,
    ) => THooks[TKey] | undefined,
  ) => TResult,
): Fn<Fn<TContext, TResult>, TResult> {
  const hooks: Record<symbol, HookFn<TContext> | undefined> = {};
  const callHook = <TKey extends keyof THooks>(
    hookName: TKey,
    context: TContext,
  ) => {
    const hookFn = hooks[Symbol.for(hookName as string)];
    return hookFn != null ? (hookFn(context) as THooks[TKey]) : undefined;
  };
  const executor = (fn: Fn<TContext, TResult>) => {
    const subscription = binder$.subscribe(({ fn: hook, name }) => {
      hooks[name] = hook;
    });
    const result = execFunc(fn, callHook);
    subscription.unsubscribe();
    return result;
  };
  return executor;
}
