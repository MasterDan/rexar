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

  private trailingTemplate: HTMLTemplateElement | undefined;

  unmount(): Promise<void> {
    if (this.node == null) {
      throw new Error('Nothing To Unmount');
    }
    if (this.target$.val == null) {
      throw new Error('Target not exists');
    }
    this.node.parentNode?.removeChild(this.node);
    if (this.trailingTemplate) {
      this.trailingTemplate.remove();
    }
    this.nextTarget$.val = this.target$.val;
    return Promise.resolve();
  }

  renderInto(binding: IBinding) {
    const component = this.component as Component<ITextComponentProps>;
    const text$ = component.getProp('value');
    const inserTrailingTemlate = component.getProp('trailingTemplate') ?? false;

    const valueChanged$ = container.resolve(DocumentRef).instance$.pipe(
      switchMap((doc) =>
        text$.pipe(
          map((str) => ({
            str,
            doc,
          })),
        ),
      ),
    );
    valueChanged$.subscribe(({ str }) => {
      if (this.node) {
        this.node.textContent = str;
      }
    });
    return valueChanged$.pipe(
      map(({ doc, str }) => {
        if (this.node != null) {
          return undefined;
        }
        this.node = doc.createTextNode(str);
        this.trailingTemplate = inserTrailingTemlate
          ? doc.createElement('template')
          : undefined;
        switch (binding.role) {
          case BindingTargetRole.Parent:
            if (inserTrailingTemlate) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              binding.target.prepend(this.trailingTemplate!);
            }
            binding.target.prepend(this.node);
            break;
          case BindingTargetRole.PreviousSibling:
            if (inserTrailingTemlate) {
              binding.parentEl.insertBefore(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.trailingTemplate!,
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
            ? (this.trailingTemplate as HTMLElement)
            : binding.parentEl,
        };
        return nextBinding;
      }),
    );
  }
}
