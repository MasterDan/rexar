import {
  IListComponentProps,
  listComponentName,
} from '@core/components/builtIn/list.component';
import { Component } from '@core/components/conmponent';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IRenderer';

export class ListRendererHtml implements IHtmlRenderer {
  constructor(private component: Component<IListComponentProps>) {
    if (component.name !== listComponentName) {
      throw new Error('Must provide list component');
    }
  }

  renderInto(binding: IBinding): Promise<IBinding | undefined> {
    const content = this.component.getProp('content') ?? [];

    throw new Error('Method not implemented.');
  }
}
