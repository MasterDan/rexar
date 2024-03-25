import type { BaseProps } from '@rexar/jsx';
import type { AnyRecord } from '@rexar/tools';
import { Subject } from 'rxjs';
import { ComponentFactory } from './component-factory';
import type { ComponentOptions } from './component';

export type ComponentRenderFunc<TProps extends AnyRecord = AnyRecord> = (
  props: TProps & BaseProps,
  options?: Partial<ComponentOptions>,
) => JSX.Element;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponentRenderFunc = ComponentRenderFunc<any>;

export function defineComponent<TProps extends AnyRecord = AnyRecord>(
  renderFn: (props: TProps & BaseProps) => JSX.Element,
): ComponentRenderFunc<TProps> {
  const factory = new ComponentFactory<TProps & BaseProps>(renderFn);
  return (props: TProps & BaseProps, options: Partial<ComponentOptions> = {}) =>
    factory.createComponent().render(props, { root: false, ...options });
}

export type RenderedController = { remove: () => void };

export type RenderTarget = string | Element | Comment;

export type RenderOptions = Omit<ComponentOptions, 'destroyer'>;

export function render<TProps extends AnyRecord = AnyRecord>(
  renderFn: ComponentRenderFunc<TProps>,
  props: TProps = {} as TProps,
) {
  const pick = (target: RenderTarget) => {
    const el =
      target instanceof Element || target instanceof Comment
        ? target
        : document.querySelector(target);
    if (el == null) {
      throw new Error('Not found element to mount!');
    }
    return el;
  };

  const renderComponent = () => {
    const destroyer = new Subject<void>();
    const renderedComponent = renderFn(props, {
      root: true,
      destroyer,
    });
    const remove = () => {
      destroyer.next();
    };
    return { renderedComponent, remove };
  };

  const into = (target: RenderTarget): RenderedController => {
    const el = pick(target);
    const { renderedComponent, remove } = renderComponent();
    el.appendChild(renderedComponent);
    return { remove };
  };
  const after = (target: RenderTarget): RenderedController => {
    const el = pick(target);
    const { renderedComponent, remove } = renderComponent();
    el.after(renderedComponent);
    return { remove };
  };
  const before = (target: RenderTarget): RenderedController => {
    const el = pick(target);
    const { renderedComponent, remove } = renderComponent();
    el.before(renderedComponent);
    return { remove };
  };
  return { into, after, before };
}
