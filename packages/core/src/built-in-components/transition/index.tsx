import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';

import {
  Observable,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  take,
} from 'rxjs';
import { defineComponent } from '@core/component';
import { onMounted } from '@core/scope';
import { Capture } from '../capture/Capture';

export type AnimationSatesDefault = 'default' | 'void';

export type AnimationKeys<
  TAdditionalKeys extends string = AnimationSatesDefault,
> = AnimationSatesDefault | TAdditionalKeys;

export type AnimationClasses = string[];

function applyState(state: AnimationClasses, el: HTMLElement) {
  console.groupCollapsed('applying', state);
  console.log('element', el);

  el.classList.add(...state);

  console.groupEnd();
}
function removeState(state: AnimationClasses, el: HTMLElement) {
  console.groupCollapsed('removing', state);
  console.log('element', el);

  el.classList.remove(...state);

  console.groupEnd();
}

class Transition<TStates extends string = AnimationSatesDefault> {
  states = new Map<AnimationKeys<TStates>, AnimationClasses>();

  transitions = new Map<string, AnimationClasses>();

  defaultState: AnimationKeys<TStates> = 'default';

  defineState<T extends AnimationKeys<TStates>>(
    state: T,
    ...classes: string[]
  ): Transition<TStates>;
  defineState<T extends string>(
    state: T,
    ...classes: string[]
  ): Transition<TStates | T>;
  defineState<T extends AnimationKeys<TStates> | string>(
    state: T,
    ...classes: string[]
  ): Transition<TStates | T> {
    const self = this as Transition<TStates | T>;
    self.states.set(state, classes);
    return self;
  }

  defineTransition<T extends AnimationKeys<TStates>>(
    { from, to, reverse }: { from: T | '*'; to: T | '*'; reverse?: boolean },
    ...classes: string[]
  ): Transition<TStates> {
    const transitionKey = `${from}=>${to}`;
    this.transitions.set(transitionKey, classes);
    if (reverse ?? false) {
      const reverseTransitionKey = `${to}=>${from}`;
      this.transitions.set(reverseTransitionKey, classes);
    }
    return this;
  }

  withDefault(state: AnimationKeys<TStates>) {
    const newTransition = new Transition<TStates>();
    newTransition.states = new Map(this.states);
    newTransition.transitions = new Map(this.transitions);
    newTransition.defaultState = state;
    return newTransition;
  }

  attachTo(el: ValueOrObservableOrGetter<HTMLElement | undefined>) {
    const el$ = toObservable(el).pipe(
      filter((v): v is HTMLElement => v != null),
    );
    // el$.subscribe((v) => {
    //   console.log('el is', v);
    // });
    const processing$ = ref(false);
    const state$ = ref<AnimationKeys<TStates>>(this.defaultState);
    // processing$.subscribe((v) => {
    //   console.log('processing is', v);
    // });
    // state$.subscribe((v) => {
    //   console.log('state is', v);
    // });

    state$
      .pipe(combineLatestWith(el$), take(1))
      .subscribe(([stateKey, element]) => {
        const initState =
          stateKey === '*' ? undefined : this.states.get(stateKey);
        if (initState) {
          applyState(initState, element);
        }
      });

    const setState = (state: AnimationKeys<TStates>) => {
      state$.value = state;
    };

    const bindState = (
      stateToBind$: ValueOrObservableOrGetter<AnimationKeys<TStates>>,
    ) => {
      toObservable(stateToBind$)
        .pipe(
          switchMap((state) =>
            // wait until processing ends
            processing$.pipe(
              filter((p) => !p),
              take(1),
              map(() => state),
            ),
          ),
        )
        .subscribe(setState);
    };

    const statePairwise$ = state$.pipe(
      distinctUntilChanged(),
      pairwise(),
    ) as unknown as Observable<
      [AnimationKeys<TStates> | '*', AnimationKeys<TStates> | '*']
    >;

    statePairwise$
      .pipe(
        map(([from, to]) => ({ from, to })),
        combineLatestWith(el$),
      )
      .subscribe(([{ from, to }, element]) => {
        console.log('Transition from', from, 'to', to, 'on', element);

        processing$.value = true;
        const fromState = from === '*' ? undefined : this.states.get(from);
        const toState = to === '*' ? undefined : this.states.get(to);
        const transitions = [
          this.transitions.get(`${from}=>${to}`),
          this.transitions.get(`${from}=>*`),
          this.transitions.get(`*=>${to}`),
          this.transitions.get('*=>*'),
        ].filter((i): i is AnimationClasses => i != null);

        if (transitions.length > 0) {
          transitions.forEach((transition) => {
            applyState(transition, element);
          });
        }
        if (toState != null) {
          applyState(toState, element);
        }
        if (fromState != null) {
          removeState(fromState, element);
        }
        if (transitions.length === 0) {
          processing$.value = false;
          return;
        }

        const removeFromState = () => {
          console.log('Transition ended');
          transitions.forEach((transition) => {
            removeState(transition, element);
          });
          element.removeEventListener('transitionend', removeFromState);
          processing$.value = false;
        };
        element.addEventListener('transitionend', removeFromState);
      });

    return {
      bindState,
    };
  }

  createComponent() {
    return defineComponent<{
      state: ValueOrObservableOrGetter<AnimationKeys<TStates>>;
    }>(({ children, state }) => {
      const el$ = ref<HTMLElement>();

      onMounted().subscribe(() => {
        const { bindState } = this.attachTo(el$);
        bindState(state);
      });
      return <Capture el$={el$}>{children}</Capture>;
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTransition = Transition<any>;

export type AnimationKeysOf<T extends AnyTransition> = T extends Transition<
  infer TStates
>
  ? AnimationKeys<TStates>
  : never;

export function createTransition<
  TStates extends string = AnimationSatesDefault,
>() {
  return new Transition<TStates>();
}

