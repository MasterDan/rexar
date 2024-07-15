import { JSX } from '../jsx/@types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Props = Record<string, any>;

export type Component<TProps extends Props = Props> = (
  props: TProps,
) => JSX.Element;

export type ParentProps<TProps extends Props = Props> = TProps & {
  children?: JSX.Element;
};

export type ParentComponent<TProps extends Props = Props> = Component<
  ParentProps<TProps>
>;

export type ParentPropsStrict<
  TProps extends Props = Props,
  TChildren = JSX.Element,
> = TProps & {
  children: TChildren;
};

export type ParentComponentStrict<
  TProps extends Props = Props,
  TChildren = JSX.Element,
> = Component<ParentPropsStrict<TProps, TChildren>>;

export type ChildFreeProps<TProps extends Props = Props> = TProps & {
  children?: never;
};

export type ChildFreeComponent<TProps extends Props = Props> = Component<
  ChildFreeProps<TProps>
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = Component<any>;

