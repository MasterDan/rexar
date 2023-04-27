import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { map, of, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

@injectable()
export class TextRendererHtml extends HtmlRendererBase {
  private node: Text | undefined;

  renderInto(binding: IBinding) {
    const text$ = (this.component as Component<ITextComponentProps>).getProp(
      'value',
    );
    if (text$ == null) {
      return of(undefined);
    }
    console.log('writing', text$.val, 'into', binding);

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
          switch (binding.role) {
            case BindingTargetRole.Parent:
              binding.target.prepend(this.node);
              break;
            case BindingTargetRole.PreviousSibling:
              binding.parentEl.insertBefore(
                this.node,
                binding.target.nextSibling,
              );
              break;
            default:
              break;
          }
        } else {
          this.node.textContent = str;
        }
      });
    return of(undefined);
  }
}
