// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class TreeNode<T = any> {
  parent?: TreeNode;

  nextSibling?: TreeNode;

  constructor(public value: T) {}
}
