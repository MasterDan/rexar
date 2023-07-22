import { JSDOM } from 'jsdom';
import { IDocumentRef } from './@types/IDocumentRef';

export class DocumentRefDev implements IDocumentRef {
  // eslint-disable-next-line class-methods-use-this
  get document() {
    return new JSDOM('<div id="app" ></div>').window.document;
  }
}
