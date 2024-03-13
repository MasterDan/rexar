import type {
  EventAttributes,
  StyleAttributes,
  SVGAttributes,
  HTMLAttributes,
  EventHandler,
} from 'tsx-dom-types';

import type { MaybeObservable, Providable } from '@rexar/reactivity';
import type { AnyRecord } from '@rexar/tools';
import { Subject } from 'rxjs';

export type MaybeObservableRecord<T extends AnyRecord<string>> = {
  [Key in keyof T]: T[Key] | Providable<T[Key] | null | undefined>;
};

export type EventAttributesExtended<T extends EventTarget> = {
  [Key in keyof EventAttributes<T>]: EventAttributes<T>[Key] extends
    | EventHandler<T, infer E>
    | undefined
    ? EventHandler<T, E> | Subject<E> | undefined
    : never;
};

export type ComponentChild =
  | ComponentChild[]
  | JSX.Element
  | Providable<string | number | boolean | undefined | null>;
export type ComponentChildren = ComponentChild | ComponentChild[];
export interface BaseProps {
  children?: ComponentChildren;
}
export type RenderFunction = (props: BaseProps) => JSX.Element;
export type ComponentAttributeValues =
  | string
  | number
  | boolean
  | undefined
  | null
  | StyleAttributes
  | EventListenerOrEventListenerObject
  | Providable<
      | string
      | number
      | boolean
      | undefined
      | null
      | StyleAttributes
      | EventListenerOrEventListenerObject
    >;

export type ComponentAttributes = {
  [s: string]: ComponentAttributeValues;
};

export interface HTMLComponentProps extends BaseProps {
  dangerouslySetInnerHTML?: MaybeObservable<string>;
}

export type SVGAndHTMLElementKeys = keyof SVGElementTagNameMap &
  keyof HTMLElementTagNameMap;
export type SVGOnlyElementKeys = Exclude<
  keyof SVGElementTagNameMap,
  SVGAndHTMLElementKeys
>;
export type IntrinsicElementsHTML = {
  [TKey in keyof HTMLElementTagNameMap]?: MaybeObservableRecord<HTMLAttributes> &
    HTMLComponentProps &
    EventAttributesExtended<HTMLElementTagNameMap[TKey]>;
};
export type IntrinsicElementsSVG = {
  [TKey in SVGOnlyElementKeys]?: SVGAttributes &
    HTMLComponentProps &
    EventAttributes<SVGElementTagNameMap[TKey]>;
};

export type IntrinsicElementsHTMLAndSVG = IntrinsicElementsHTML &
  IntrinsicElementsSVG;

export interface TsxConfig {
  [s: string]: boolean;
}

// Returns TIF if T is specified as true in TsxConfig, otherwise TELSE
type IfTsxConfig<T extends string, TIF, TELSE> = TsxConfig[T] extends false
  ? TELSE
  : TIF;

type IntrinsicElementsCombined = IfTsxConfig<
  'html',
  IntrinsicElementsHTML,
  unknown
> &
  IfTsxConfig<'svg', IntrinsicElementsSVG, unknown>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // Return type of jsx syntax
    type Element =
      | IfTsxConfig<'html', HTMLElement, never>
      | IfTsxConfig<'svg', SVGElement, never>;

    // The property name to use
    interface ElementAttributesProperty {
      props: unknown;
    }

    // The children name to use
    interface ElementChildrenAttribute {
      children: unknown;
    }

    // The available string tags
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface IntrinsicElements extends IntrinsicElementsCombined {}
  }
}
