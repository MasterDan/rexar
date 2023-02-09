import { IBinding } from './binding-target';

export interface IHtmlRenderer {
  renderInto(binding: IBinding): Promise<IBinding | undefined>;
}
