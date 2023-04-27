import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { Component } from '@core/components/component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { map, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

@injectable()
export class TextRendererHtml extends HtmlRendererBase {
  private node: Text | undefined;

  renderInto(binding: IBinding) {
    const component = this.component as Component<ITextComponentProps>;
    const text$ = component.getProp('value');
    const inserTrailingTemlate = component.getProp('trailingTemplate') ?? false;

    console.log('writing', text$.val, 'into', binding);

    return container.resolve(DocumentRef).instance$.pipe(
      switchMap((doc) =>
        text$.pipe(
          map((str) => ({
            str,
            doc,
          })),
        ),
      ),
      map(({ doc, str }) => {
        if (this.node == null) {
          this.node = doc.createTextNode(str);
          console.log('text:before', binding.parentEl.outerHTML);
          const trailingTemplate = inserTrailingTemlate
            ? doc.createElement('template')
            : undefined;
          switch (binding.role) {
            case BindingTargetRole.Parent:
              if (inserTrailingTemlate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                binding.target.prepend(trailingTemplate!);
              }
              binding.target.prepend(this.node);
              break;
            case BindingTargetRole.PreviousSibling:
              if (inserTrailingTemlate) {
                binding.parentEl.insertBefore(
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  trailingTemplate!,
                  binding.target.nextSibling,
                );
              }
              binding.parentEl.insertBefore(
                this.node,
                binding.target.nextSibling,
              );
              break;
            default:
              break;
          }
          const nextBinding: IBinding = {
            parentEl: binding.parentEl,
            role: BindingTargetRole.PreviousSibling,
            target: inserTrailingTemlate
              ? (trailingTemplate as HTMLElement)
              : binding.parentEl,
          };
          console.log('tet:after', binding.parentEl.outerHTML);
          return nextBinding;
        }
        this.node.textContent = str;
        return undefined;
      }),
    );
  }
}
