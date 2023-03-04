import { Subject } from 'rxjs';
import { AnyFunc, Func } from './@types/func';

type HooksDefinition = Record<string, AnyFunc>;

export interface IHookTrack {
  name: string;
  fn: AnyFunc;
}

interface ICurrentHookTrack<THDef extends HooksDefinition = HooksDefinition> {
  name: keyof THDef;
  fn: AnyFunc;
}

type HooksStore<THDef extends HooksDefinition = HooksDefinition> = {
  [TKey in keyof THDef]?: THDef[TKey][];
};
const onHookAdd$ = new Subject<IHookTrack>();

export class HooksLab<
  Targs,
  TResult,
  THooks extends HooksDefinition = HooksDefinition,
> {
  private hooks: HooksStore<THooks> = {};

  onHookAdd$ = new Subject<ICurrentHookTrack<THooks>>();

  constructor() {
    this.onHookAdd$.subscribe(({ name, fn }) => {
      const func = fn as THooks[keyof THooks];
      const namedHooks = this.hooks[name];
      if (namedHooks) {
        namedHooks.push(func);
      } else {
        this.hooks[name] = [func];
      }
    });
  }

  callFunction(fn: Func<Targs, TResult>, arg: Targs): TResult {
    const subscription = onHookAdd$.subscribe(({ name, fn: fnSub }) => {
      const nameKey = name as keyof THooks;
      this.onHookAdd$.next({
        fn: fnSub,
        name: nameKey,
      });
    });
    const result = fn(arg);
    subscription.unsubscribe();
    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  defineHook<TKey extends keyof THooks>(name: TKey) {
    return (hook: THooks[TKey]) => {
      onHookAdd$.next({
        name: name as string,
        fn: hook,
      });
    };
  }

  callHooks<TKey extends keyof THooks>(
    name: TKey,
    arg: Parameters<THooks[TKey]>[0],
  ) {
    return this.hooks[name]?.map((hook): ReturnType<THooks[TKey]> => hook(arg));
  }
}
