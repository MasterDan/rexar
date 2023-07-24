import { IDocumentRef } from './@types/IDocumentRef';

export class DocumentRef implements IDocumentRef {
  // eslint-disable-next-line class-methods-use-this
  get document() {
    return window.document;
  }
}
