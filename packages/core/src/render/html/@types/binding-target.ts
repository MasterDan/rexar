export type BindingTarget = Element | DocumentFragment;

export enum BindingTargetRole {
  Parent,
  PreviousSibling,
}

export interface IBinding {
  target: BindingTarget;
  parentEl: Element;
  role: BindingTargetRole;
}
