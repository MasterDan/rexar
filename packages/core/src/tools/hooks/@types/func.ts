export type Func<TArgs, TResult> = (args: TArgs) => TResult;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFunc = Func<any, any>;
