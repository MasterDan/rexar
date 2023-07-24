import { describe, test, expect, beforeAll } from 'vitest';
import { DocumentRefDev } from '@core/render/html/documentRef/document-ref.dev';
import { el } from './element.component';
import { list } from './list.component';
import { documentRefToken } from '../module';

describe('list-component', () => {
  beforeAll(() => {
    documentRefToken.provide(DocumentRefDev);
  });
  test('simple', () => {
    const testListOne = list([
      el({ name: 'div', attrs: { class: 'foo' } }),
      el({ name: 'div', attrs: { class: 'bar' } }),
      el({ name: 'span', attrs: { class: 'baz' } }),
    ]);
    expect(testListOne.getProp('content').value.length).toBe(3);
    const testListTwo = list([
      el({ name: 'div', attrs: { class: 'bar-2' } }),
      el({ name: 'span', attrs: { class: 'baz-2' } }),
    ]);
    expect(testListTwo.getProp('content').value.length).toBe(2);
    expect(testListOne.getProp('content').value.length).toBe(3);
  });
});

