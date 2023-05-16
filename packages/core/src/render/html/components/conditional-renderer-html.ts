import { Observable } from 'rxjs';
import { injectable } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { HtmlRendererBase } from '../base/html-renderer-base';

@injectable()
export class ConditionalRendererHtml extends HtmlRendererBase {
  // eslint-disable-next-line class-methods-use-this
  renderInto(_target: IBinding): Observable<IBinding | undefined> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line class-methods-use-this
  unmount(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
