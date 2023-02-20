import { CustomComponent } from '@core/components/builtIn/custom/custom-template-component';
import { Observable } from 'rxjs';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';

export class CustomRendererHtml extends HtmlRendererBase {
  renderInto(target: IBinding): Observable<IBinding | undefined> {
    if (!(this.component instanceof CustomComponent)) {
      throw new Error('Component should be custom');
    }
    throw new Error('Method not implemented.');
  }
}
