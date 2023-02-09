import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/conmponent';
import { IBinding } from '../@types/binding-target';
import { IHtmlRenderer } from '../@types/IRenderer';

export class TextRendererHtml implements IHtmlRenderer {
  constructor(private component: Component<ITextComponentProps>) {
    if (component.name !== 'text') {
      throw new Error('Must provide text component');
    }
  }

  renderInto(binding: IBinding): Promise<IBinding | undefined> {
    const text = this.component.getProp('value');
    binding.target.append(text?.value ?? '');
    return Promise.resolve(undefined);
  }
}
