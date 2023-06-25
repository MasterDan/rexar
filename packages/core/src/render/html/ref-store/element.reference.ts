import { IElementComponentProps } from '@core/components/builtIn/element.component';
import { Component } from '@core/components/component';
import { ref$ } from '@rexar/reactivity';

export class ElementReference {
  el = ref$<HTMLElement>();

  component = ref$<Component<IElementComponentProps>>();
}
