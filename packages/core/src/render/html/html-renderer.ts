import { DocumentRef } from './documentRef';

export class HtmlRenderer {
  constructor(private documnetRef: DocumentRef) {}

  async render() {
    const document = await this.documnetRef.instance;
    document.createDocumentFragment();
  }
}
