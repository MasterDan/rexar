import { ComponentAttributes } from '../@types';

export function createDomElement(
  tag: string,
  attrs: ComponentAttributes | null,
) {
  const options = attrs?.is ? { is: attrs.is as string } : undefined;

  if (attrs?.xmlns)
    return document.createElementNS(
      attrs.xmlns as string,
      tag,
      options,
    ) as SVGElement;

  return document.createElement(tag, options);
}
