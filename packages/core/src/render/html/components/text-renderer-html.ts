import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/conmponent';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { map, of } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { container } from 'tsyringe';
import { IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

export class TextRendererHtml extends HtmlRendererBase {
  private node: Text | undefined;

  renderInto(binding: IBinding) {
    const text$ = (this.component as Component<ITextComponentProps>).getProp(
      'value',
    );
    if (text$ == null) {
      return of(undefined);
    }
    container
      .resolve(DocumentRef)
      .instance$.pipe(
        switchMap((doc) =>
          text$.pipe(
            map((str) => ({
              str,
              doc,
            })),
          ),
        ),
      )
      .subscribe(({ doc, str }) => {
        if (this.node == null) {
          this.node = doc.createTextNode(str);
          binding.target.append(this.node);
        } else {
          this.node.textContent = str;
        }
      });
    return of(undefined);
  }
}
