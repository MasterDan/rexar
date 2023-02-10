import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/conmponent';
import { HtmlRendererBase } from '@core/render/base/html-renderer-base';
import { of } from 'rxjs';
import { IBinding } from '../@types/binding-target';

export class TextRendererHtml extends HtmlRendererBase {
  constructor(private component: Component<ITextComponentProps>) {
    super();
    if (component.name !== 'text') {
      throw new Error('Must provide text component');
    }
  }

  renderInto(binding: IBinding) {
    const text = this.component.getProp('value');
    binding.target.append(text?.value ?? '');
    return of(undefined);
  }
}
