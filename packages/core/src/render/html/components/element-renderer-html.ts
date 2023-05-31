import { list } from '@core/components/builtIn/list.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from, of, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { IElementComponentProps } from '@core/components/builtIn/html-element.component';
import { Component } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';
import { RefStore } from '../ref-store/ref-store';
import { ElementReference } from '../ref-store/element.reference';
import { resolveRenderer } from '../tools';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';

@injectable()
export class ElementRendererHtml extends HtmlRendererBase<IElementComponentProps> {
  private el: HTMLElement | undefined;

  private transformedElementRenderer: IHtmlRenderer | undefined;

  constructor(private refStore: RefStore) {
    super();
  }

  get elComponent(): Component<IElementComponentProps> {
    const name = this.component.getProp('name');
    if (name == null) {
      throw new Error('Element must have name');
    }
    if (this.component.type !== ComponentType.HTMLElement) {
      throw new Error('Component must render single element');
    }
    return this.component;
  }

  unmount(): Promise<void> {
    if (this.transformedElementRenderer) {
      return this.transformedElementRenderer.unmount();
    }
    if (this.el == null) {
      throw new Error('NothingToUnmount');
    }
    if (this.target$.value == null) {
      throw new Error('Target not exists');
    }
    this.el.remove();
    this.nextTarget$.value = this.target$.value;
    return Promise.resolve();
  }

  renderInto(binding: IBinding) {
    if (this.elComponent.id && !this.elComponent.preventTransformation) {
      const { transformer } = this.refStore.getReferences(this.elComponent.id);
      if (!transformer.isEmpty) {
        if (!transformer.isTrasformationDone) {
          transformer.apply(this.elComponent);
        }
        this.transformedElementRenderer = resolveRenderer(
          transformer.transformationResult,
        );
        this.target$.subscribe((t) => {
          if (this.transformedElementRenderer) {
            this.transformedElementRenderer.target$.value = t;
          }
        });
        const renderTransformedAsync = async () => {
          if (!this.transformedElementRenderer) {
            return undefined;
          }
          await this.transformedElementRenderer.render();
          return this.transformedElementRenderer.nextTarget$;
        };
        return from(renderTransformedAsync()).pipe(
          switchMap((x) => x ?? of(undefined)),
        );
      }
    }
    const name = this.elComponent.getProp('name');
    const attrs = this.elComponent.getProp('attrs') ?? {};
    const children = this.elComponent.getProp('children') ?? [];
    const renderEleMent = async (doc: Document) => {
      const el = doc.createElement(name);
      this.el = el;
      Object.keys(attrs).forEach((k) => {
        el.setAttribute(k, attrs[k] ?? '');
      });
      if (children.length > 0) {
        const listComp = list(children);
        listComp.bindProp('content', children);
        const renderer = resolveRenderer(listComp, {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        });
        await renderer.render();
      }
      switch (binding.role) {
        case BindingTargetRole.Parent:
          binding.target.prepend(el);
          break;
        case BindingTargetRole.PreviousSibling:
          binding.parentEl.insertBefore(el, binding.target.nextSibling);
          break;
        default:
          break;
      }
      // console.log(el.outerHTML);
      if (this.elComponent.id) {
        const ref = new ElementReference();
        ref.el.value = el;
        const { reference } = this.refStore.getReferences(this.elComponent.id);
        reference.el.value = el;
        reference.component.value = this.elComponent;
      }
      // console.log(binding.parentEl.outerHTML);

      return {
        parentEl: binding.parentEl,
        role: BindingTargetRole.PreviousSibling,
        target: el,
      };
    };
    return container
      .resolve(DocumentRef)
      .instance$.pipe(switchMap((d) => from(renderEleMent(d))));
  }
}
