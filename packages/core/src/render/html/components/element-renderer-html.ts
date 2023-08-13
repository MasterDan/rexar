import { list } from '@core/components/builtIn/list.component';
import { HtmlRendererBase } from '@core/render/html/base/html-renderer-base';
import { filter, from, map, of, pairwise, switchMap } from 'rxjs';
import { container } from '@rexar/di';
import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { Component } from '@core/components/component';
import { ComponentType } from '@core/components/component-type';
import { HtmlElementNames } from '@core/parsers/html/tags/html-names';
import { ScopedLogger } from '@rexar/logger';
import { ref$ } from '@rexar/reactivity';
import { BindingTargetRole, IBinding } from '../@types/binding-target';
import { RefStore } from '../ref-store/ref-store';
import { resolveRenderer } from '../tools';
import { IHtmlRenderer } from '../@types/IHtmlRenderer';
import { ComponentLifecycle } from '../base/lifecycle';
import { IDocumentRef } from '../documentRef/@types/IDocumentRef';

export class ElementRendererHtml extends HtmlRendererBase<IElementComponentProps> {
  private $logger: ScopedLogger | undefined;

  private get logger() {
    if (this.$logger == null) {
      throw new Error('Logger for custom component not been set');
    }
    return this.$logger;
  }

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

  private references$ = ref$(
    this.component$.pipe(
      map((c) => c.id),
      filter((id): id is string => id != null),
      map((id) => this.refStore.getReferences(id)),
    ),
  );

  async unmount(): Promise<void> {
    this.logger.debug('Unmounting');
    if (this.transformedElementRenderer) {
      this.lifecycle$.value = ComponentLifecycle.BeforeUnmount;
      await this.transformedElementRenderer.unmount();
      this.logger.debug('Transformation unmounted');
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
    this.$logger = ScopedLogger.createScope.sibling(
      `${this.elComponent.getProp('name')}${
        this.elComponent.id == null ? '' : ` (${this.elComponent.id})`
      }`,
    );

    if (this.elComponent.id == null && isSlot) {
      this.lifecycle$.value = ComponentLifecycle.Rendered;
      return of(binding);
    }

    if (
      this.references$.value != null &&
      this.references$.value.transformer.isEmpty &&
      isSlot
    ) {
      this.references$.value.transformer.append(
        (c: Component<IElementComponentProps>) =>
          list(c.getProp('children') ?? []),
      );
    }

    if (
      this.references$.value != null &&
      !this.references$.value.transformer.isEmpty &&
      !this.references$.value.transformer.isTransformationDone
    ) {
      const { transformer } = this.references$.value;

      transformer.apply(this.elComponent);

      this.transformedElementRenderer = resolveRenderer(
        transformer.transformationResult,
        binding,
      );
      this.transformedElementRenderer.subscribeParentLifecycle(this.lifecycle$);

      this.transformedElementRenderer.lifecycle$
        .pipe(
          pairwise(),
          filter(
            ([prev, curr]) =>
              prev === ComponentLifecycle.Mounted &&
              curr === ComponentLifecycle.BeforeUnmount,
          ),
        )
        .subscribe(() => {
          transformer.isTransformationDone = false;
        });

      this.target$.subscribe((t) => {
        if (this.transformedElementRenderer) {
          this.transformedElementRenderer.target$.value = t;
        }
      });
      ScopedLogger.createScope.child('Transformation', { captureNext: true });
      const renderTransformedAsync = async () => {
        if (!this.transformedElementRenderer) {
          this.lifecycle$.value = ComponentLifecycle.Rendered;
          return undefined;
        }
        await this.transformedElementRenderer.render();
        this.lifecycle$.value = ComponentLifecycle.Rendered;
        ScopedLogger.endScope();
        return this.transformedElementRenderer.nextTarget$;
      };
      return from(renderTransformedAsync()).pipe(
        switchMap((x) => x ?? of(undefined)),
      );
    }

    const name = this.elComponent.getProp('name');
    const attrs = this.elComponent.getProp('attrs') ?? {};
    const children = this.elComponent.getProp('children') ?? [];
    const renderElement = async () => {
      const doc = container.resolve<IDocumentRef>('IDocumentRef').document;
      const el = doc.createElement(name);
      this.el = el;
      Object.keys(attrs).forEach((k) => {
        el.setAttribute(k, attrs[k] ?? '');
      });
      if (children.length > 1) {
        ScopedLogger.createScope.child('Content', { captureNext: true });
        const listComp = list(children);
        listComp.bindProp('content', children);
        const childrenRenderer = resolveRenderer(listComp, {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        });
        childrenRenderer.subscribeParentLifecycle(this.lifecycle$);
        await childrenRenderer.render();
        ScopedLogger.endScope();
      }
      if (children.length === 1) {
        ScopedLogger.createScope.child('Content', { captureNext: true });
        const [child] = children;
        const childRenderer = resolveRenderer(child, {
          parentEl: el,
          role: BindingTargetRole.Parent,
          target: el,
        });
        childRenderer.subscribeParentLifecycle(this.lifecycle$);
        await childRenderer.render();
        ScopedLogger.endScope();
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

      if (this.references$.value != null) {
        const { reference } = this.references$.value;
        reference.el.value = el;
        reference.component.value = this.elComponent;
      }

      this.lifecycle$.value = ComponentLifecycle.Rendered;
      ScopedLogger.endScope();
      return {
        parentEl: binding.parentEl,
        role: BindingTargetRole.PreviousSibling,
        target: el,
      };
    };

    return from(renderElement());
  }
}
