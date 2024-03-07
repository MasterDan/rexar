/* eslint-disable no-restricted-syntax */

import { AnyRecord } from '@rexar/tools';
import { trySubscribe } from '@rexar/reactivity';
import { Subject, isObservable } from 'rxjs';
import { ComponentAttributeValues, ComponentAttributes } from '../@types';

function transferKnownProperties<
  TSource extends AnyRecord = AnyRecord,
  TTarget extends AnyRecord = AnyRecord,
>(source: TSource, target: TTarget) {
  for (const key of Object.keys(source)) {
    if (key in target) {
      target[key as keyof TTarget] = source[key];
    }
  }
}

export function setAttributes(
  element: JSX.Element,
  attrs: ComponentAttributes,
) {
  const subscribeEvent = (name: string, value: ComponentAttributeValues) => {
    const finalName = name.replace(/Capture$/, '');
    const useCapture = name !== finalName;
    const eventName = finalName.toLowerCase().substring(2);
    element.addEventListener(
      eventName,
      isObservable(value)
        ? (e: Event) => {
            (value as Subject<Event>).next(e);
          }
        : (value as EventListenerOrEventListenerObject),
      useCapture,
    );
  };

  const setAttribute = (name: string, value: ComponentAttributeValues) => {
    if (name === 'style' && value != null && typeof value === 'object') {
      // Special handler for style with a value of type CSSStyleDeclaration
      transferKnownProperties(value, element.style);
    } else if (name === 'value' && element instanceof HTMLInputElement) {
      element.value = value?.toString() ?? '';
    } else if (name === 'dangerouslySetInnerHTML') {
      element.innerHTML = value as string;
    } else if (typeof value === 'boolean') {
      if (value) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    } else if (value != null) {
      element.setAttribute(name, value.toString());
    }
  };

  for (const name of Object.keys(attrs)) {
    // Ignore some debug props that might be added by bundlers
    // eslint-disable-next-line no-continue
    if (name === '__source' || name === '__self') continue;

    const value = attrs[name];
    if (name.startsWith('on')) {
      subscribeEvent(name, value);
    } else {
      trySubscribe(value, (val) => {
        setAttribute(name, val);
      });
    }
  }
}
