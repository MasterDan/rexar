import { ITextComponentProps } from '@core/components/builtIn/text.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { map } from 'rxjs';
import { container } from '@rexar/di';
import { ScopedLogger } from '@rexar/logger';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { ComponentLifecycle } from '../base/lifecycle';
import { IDocumentRef } from '../documentRef/@types/IDocumentRef';

export class TextRendererHtml extends HtmlRendererBase<ITextComponentProps> {
  private node: Text | undefined;

  private trailingComment: Element | undefined;

  unmount(): Promise<void> {
    if (this.node == null) {
      throw new Error('Nothing To Unmount');
    }
    if (this.target$.value == null) {
      throw new Error('Target not exists');
    }
    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    this.node.parentNode?.removeChild(this.node);
    if (this.trailingComment) {
      this.trailingComment.remove();
    }
    this.nextTarget$.value = this.target$.value;
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
    return Promise.resolve();
  }

  renderInto(binding: IBinding) {
    const logger = ScopedLogger.createScope.sibling('Text');
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    const text$ = this.component.getProp('value');
    const inserTrailingComment =
      this.component.getProp('trailingComment') ?? false;
    const documentInstance =
      container.resolve<IDocumentRef>('IDocumentRef').document;

    const valueChanged$ = text$.pipe(
      map((str) => ({
        str,
        doc: documentInstance,
      })),
    );
    valueChanged$.subscribe(({ str }) => {
      if (this.node) {
        this.node.textContent = str;
        logger.info(str);
      }
    });
    ScopedLogger.endScope();
    return valueChanged$.pipe(
      map(({ doc, str }) => {
        if (this.node != null) {
          return undefined;
        }
        this.node = doc.createTextNode(str);
        logger.info(str);
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
        this.lifecycle$.value = ComponentLifecycle.Rendered;
        return nextBinding;
      }),
    );
  }
}

