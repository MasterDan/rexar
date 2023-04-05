import { Subject } from 'rxjs';
import { Func } from './@types/func';
import { FunctionalHook, HookInput, HookOutput } from './functional-hook';
import { HookBase } from './hook-base';

/** Collection of Hooks */
type HooksDefinition = Record<string, HookBase>;

/** Shoud be passed into onHookAdd$ */
export interface IHookTrack {
  name: string;
  hook: HookBase;
}

interface ICurrentHookTrack<THDef extends HooksDefinition = HooksDefinition> {
  name: keyof THDef;
  hook: HookBase;
}

type HooksStore<THDef extends HooksDefinition = HooksDefinition> = {
  [TKey in keyof THDef]?: THDef[TKey][];
};
/** Global event for passing hooks */
const onHookAdd$ = new Subject<IHookTrack>();

export class HooksLab<
  Targs,
  TResult,
  THooks extends HooksDefinition = HooksDefinition,
> {
  private hooks: HooksStore<THooks> = {};

  onHookAdd$ = new Subject<ICurrentHookTrack<THooks>>();

  constructor() {
    this.onHookAdd$.subscribe(({ name, hook }) => {
      const func = hook as THooks[keyof THooks];
      const namedHooks = this.hooks[name];
      if (namedHooks) {
        namedHooks.push(func);
      } else {
        this.hooks[name] = [func];
      }
    });
  }

  callFunction(fn: Func<Targs, TResult>, arg: Targs): TResult {
    const subscription = onHookAdd$.subscribe(({ name, hook: fnSub }) => {
      const nameKey = name as keyof THooks;
      this.onHookAdd$.next({
        hook: fnSub,
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
        hook,
      });
    };
  }

  callHooks<TKey extends keyof THooks, THook extends FunctionalHook>(
    name: TKey,
    arg: HookInput<THook>,
  ) {
    return this.hooks[name]
      ?.filter((h) => h instanceof FunctionalHook)
      ?.map((hook): HookOutput<THook> => (hook as unknown as THook).fn(arg));
  }
}
