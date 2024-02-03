import { BaseProps } from '@rexar/jsx';
import type { AnyRecord } from '@sir/tools';
import { Component } from './component';

export class ComponentFactory<TProps extends BaseProps = AnyRecord> {
  constructor(private render: (props: TProps) => JSX.Element) {}

  createComponent() {
    return new Component<TProps>(this.render);
  }
}
