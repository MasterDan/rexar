import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { map, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';

@injectable()
export class TextRendererHtml extends HtmlRendererBase<ITextComponentProps> {
  private node: Text | undefined;

  private trailingComment: Element | undefined;

  unmount(): Promise<void> {
    if (this.node == null) {
      throw new Error('Nothing To Unmount');
    }
    if (this.target$.val == null) {
      throw new Error('Target not exists');
    }
    this.node.parentNode?.removeChild(this.node);
    if (this.trailingComment) {
      this.trailingComment.remove();
    }
    this.nextTarget$.val = this.target$.val;
    return Promise.resolve();
  }

  renderInto(binding: IBinding) {
    const text$ = this.component.getProp('value');
    const inserTrailingComment =
      this.component.getProp('trailingComment') ?? false;

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
        this.trailingComment = inserTrailingComment
          ? (doc.createComment('end of text') as unknown as Element)
          : undefined;
        switch (binding.role) {
          case BindingTargetRole.Parent:
            if (inserTrailingComment) {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              binding.target.prepend(this.trailingComment!);
            }
            binding.target.prepend(this.node);
            break;
          case BindingTargetRole.PreviousSibling:
            if (inserTrailingComment) {
              binding.parentEl.insertBefore(
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                this.trailingComment!,
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
          target: inserTrailingComment
            ? (this.trailingComment as HTMLElement)
            : binding.parentEl,
        };
        return nextBinding;
      }),
    );
  }
}
