import { ref } from '@rexar/reactivity';
import { StyleAttributes } from '@rexar/jsx';

export type TransitionStateKeys<TAdditionalKeys = 'default' | 'void'> =
  | 'default'
  | 'void'
  | TAdditionalKeys;

export type TransitionState =
  | {
      type: 'class';
      class: string;
    }
  | {
      type: 'style';
      style: StyleAttributes;
    };

export class Transition<TStates extends string> {
  states$ = ref(new Map<TransitionStateKeys<TStates>, TransitionState>());

  transitions$ = ref(new Map<string, TransitionState>());

  currentState$ = ref<TransitionStateKeys<TStates>>('default');

  setState<T extends TransitionStateKeys<TStates>>(state: T) {
    const withClass = (className: string): Transition<TStates> => {
      this.states$.value.set(state, { type: 'class', class: className });
      return this;
    };
    const withStyle = (style: StyleAttributes): Transition<TStates> => {
      this.states$.value.set(state, { type: 'style', style });
      return this;
    };
    return { withClass, withStyle };
  }

  addState<T extends string>(state: T) {
    const self = this as Transition<TStates | T>;
    return self.setState(state);
  }

  get setTransition() {
    const from = (fromKey: TransitionStateKeys<TStates>) => {
      const to = (toKey: TransitionStateKeys<TStates>) => {
        const transitionKey = `${fromKey}=>${toKey}`;
        const withClass = (className: string): Transition<TStates> => {
          this.transitions$.value.set(transitionKey, {
            type: 'class',
            class: className,
          });
          return this;
        };
        const withStyle = (style: StyleAttributes): Transition<TStates> => {
          this.transitions$.value.set(transitionKey, { type: 'style', style });
          return this;
        };
        return { withClass, withStyle };
      };
      return { to };
    };
    return { from };
  }

  withInitialSate(state: TransitionStateKeys<TStates>) {
    this.currentState$.value = state;
    return this;
  }
}

