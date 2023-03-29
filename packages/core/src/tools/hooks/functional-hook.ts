import { Func } from './@types/func';
import { HookBase } from './hook-base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FunctionalHook<Tin = any, TOut = any> extends HookBase {
  constructor(public fn: Func<Tin, TOut>) {
    super();
  }
}

export type HookInput<T extends FunctionalHook> = Parameters<T['fn']>[0];

export type HookOutput<T extends FunctionalHook> = ReturnType<T['fn']>;
