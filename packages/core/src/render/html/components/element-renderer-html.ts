import { list } from '@core/components/builtIn/list.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { from, of, switchMap } from 'rxjs';
import { container, injectable } from 'tsyringe';
import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { Component } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { HtmlElementNames } from '@core/parsers/html/tags/html-names';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { DocumentRef } from '../documentRef';
import { RefStore } from '../ref-store/ref-store';
import { resolveRenderer } from '../tools';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { ComponentLifecycle } from '../base/lifecycle';

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

  async unmount(): Promise<void> {
    if (this.transformedElementRenderer) {
      this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
      await this.transformedElementRenderer.unmount();
      this.lifecycle$.value = ComponentLifecycle.Unmounted;
      return;
    }
    if (this.el == null) {
      throw new Error('NothingToUnmount');
    }
    if (this.target$.value == null) {
      throw new Error('Target not exists');
    }
    this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
    this.el.remove();
    this.nextTarget$.value = this.target$.value;
    this.lifecycle$.value = ComponentLifecycle.Unmounted;
  }

  renderInto(binding: IBinding) {
    this.lifecycle$.value = ComponentLifecycle.BeforeRender;
    const isSlot = this.elComponent.getProp('name') === HtmlElementNames.Slot;

    if (this.elComponent.id == null && isSlot) {
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return of(binding);
    }

    if (this.elComponent.id && !this.elComponent.preventTransformation) {
      const { transformer } = this.refStore.getReferences(this.elComponent.id);
      if (transformer.isEmpty && isSlot) {
        transformer.append((c: Component<IElementComponentProps>) =>
          list(c.getProp('children') ?? []),
        );
      }

      if (!transformer.isEmpty) {
        if (!transformer.isTrasformationDone) {
          transformer.apply(this.elComponent);
        }
        this.transformedElementRenderer = resolveRenderer(
          transformer.transformationResult,
          binding,
        );
        this.transformedElementRenderer.subscribeParentLifecycle(
          this.lifecycle$,
        );
        this.target$.subscribe((t) => {
          if (this.transformedElementRenderer) {
            this.transformedElementRenderer.target$.value = t;
          }
        });
        const renderTransformedAsync = async () => {
          if (!this.transformedElementRenderer) {
            this.lifecycle$.value = ComponentLifecycle.Rendered;
            return undefined;
          }
          await this.transformedElementRenderer.render();
          this.lifecycle$.value = ComponentLifecycle.Rendered;
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
    const renderElement = async (doc: Document) => {
      const el = doc.createElement(name);
      this.el = el;
      Object.keys(attrs).forEach((k) => {
        el.setAttribute(k, attrs[k] ?? '');
      });
      if (children.length > 1) {
        const listComp = list(children);
        listComp.bindProp('content', children);
        const childrenRenderer = resolveRenderer(listComp, {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        });
        childrenRenderer.subscribeParentLifecycle(this.lifecycle$);
        await childrenRenderer.render();
      }
      if (children.length === 1) {
        const [child] = children;
        const childRenderer = resolveRenderer(child, {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        });
        childRenderer.subscribeParentLifecycle(this.lifecycle$);
        await childRenderer.render();
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
        const { reference } = this.refStore.getReferences(this.elComponent.id);
        // console.log(
        //   'element with id',
        //   this.elComponent.id,
        //   ' putting into refStore',
        //   el,
        // );
        reference.el.value = el;
        reference.component.value = this.elComponent;
      }
      // console.log(binding.parentEl.outerHTML);
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return {
        parentEl: binding.parentEl,
        role: BindingTargetRole.PreviousSibling,
        target: el,
      };
    };
    return container
      .resolve(DocumentRef)
      .instance$.pipe(switchMap((d) => from(renderElement(d))));
  }
}
