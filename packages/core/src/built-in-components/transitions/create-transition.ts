import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { StyleAttributes } from '@rexar/jsx';
import {
  Observable,
  combineLatestWith,
  filter,
  map,
  pairwise,
  startWith,
  switchMap,
} from 'rxjs';
import { AnyRecord } from '@rexar/tools';

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

function applyState(state: TransitionState, el: HTMLElement) {
  if (state.type === 'class') {
    el.classList.add(state.class);
  } else if (state.type === 'style') {
    Object.entries(state.style).forEach(([key, value]) => {
      if (key in el.style) {
        (el.style as AnyRecord)[key] = value;
      }
    });
  }
}
function removeState(state: TransitionState, el: HTMLElement) {
  if (state.type === 'class') {
    el.classList.remove(state.class);
  } else if (state.type === 'style') {
    Object.keys(state.style).forEach((key) => {
      if (key in el.style) {
        (el.style as AnyRecord)[key] = undefined;
      }
    });
  }
}

class Transition<TStates extends string> {
  states = new Map<TransitionStateKeys<TStates>, TransitionState>();

  transitions = new Map<string, TransitionState>();

  defaultState: TransitionStateKeys<TStates> = 'default';

  setState<T extends TransitionStateKeys<TStates>>(state: T) {
    const withClass = (className: string): Transition<TStates> => {
      this.states.set(state, { type: 'class', class: className });
      return this;
    };
    const withStyle = (style: StyleAttributes): Transition<TStates> => {
      this.states.set(state, { type: 'style', style });
      return this;
    };
    return { withClass, withStyle };
  }

  addState<T extends string>(state: T) {
    const self = this as Transition<TStates | T>;
    return self.setState(state);
  }

  get setTransition() {
    const from = (fromKey: TransitionStateKeys<TStates> | '*') => {
      const to = (toKey: TransitionStateKeys<TStates> | '*') => {
        const transitionKey = `${fromKey}=>${toKey}`;
        const withClass = (className: string): Transition<TStates> => {
          this.transitions.set(transitionKey, {
            type: 'class',
            class: className,
          });
          return this;
        };
        const withStyle = (style: StyleAttributes): Transition<TStates> => {
          this.transitions.set(transitionKey, { type: 'style', style });
          return this;
        };
        return { withClass, withStyle };
      };
      return { to };
    };
    return { from };
  }

  withInitialSate(state: TransitionStateKeys<TStates>) {
    this.defaultState = state;
    return this;
  }

  attachTo(el: ValueOrObservableOrGetter<HTMLElement | undefined>) {
    const el$ = toObservable(el).pipe(filter((v) => v != null));
    const processing$ = ref(false);
    const state$ = ref<TransitionStateKeys<TStates>>(this.defaultState);

    const setState = (state: TransitionStateKeys<TStates>) => {
      state$.value = state;
    };

    const statePairwise$ = state$.pipe(
      startWith('*'),
      pairwise(),
    ) as unknown as Observable<
      [TransitionStateKeys<TStates> | '*', TransitionStateKeys<TStates> | '*']
    >;

    processing$
      .pipe(
        filter((v) => !v),
        switchMap(() => statePairwise$),
        map(([from, to]) => ({ from, to })),
        combineLatestWith(el$.pipe(filter((v): v is HTMLElement => v != null))),
      )
      .subscribe(([{ from, to }, element]) => {
        processing$.value = true;
        const fromState = from === '*' ? undefined : this.states.get(from);
        const toState = to === '*' ? undefined : this.states.get(to);
        const transition = this.transitions.get(`${from}=>${to}`);

        if (transition != null) {
          applyState(transition, element);
        }
        if (toState != null) {
          applyState(toState, element);
        }

        const removeFromState = () => {
          if (fromState != null) {
            removeState(fromState, element);
          }
          if (transition != null) {
            removeState(transition, element);
          }
          element.removeEventListener('transitionend', removeFromState);
          processing$.value = false;
        };
        element.addEventListener('transitionend', removeFromState);
      });

    return {
      setState,
    };
  }
}

export function createTransition() {
  return new Transition();
}

