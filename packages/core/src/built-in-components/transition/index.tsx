import {
  Ref,
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';

import {
  Observable,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ComponentRenderFunc, defineComponent } from '@core/component';
import { Capture } from '../capture/Capture';
import { onWaiting } from '../dynamic/waiting';

export type AnimationSatesDefault = 'default' | 'void';

export type AnimationKeys<
  TAdditionalKeys extends string = AnimationSatesDefault,
> = AnimationSatesDefault | TAdditionalKeys;

export type AnimationClasses = string[];

function applyState(state: AnimationClasses, el: HTMLElement) {
  el.classList.add(...state);
}
function removeState(state: AnimationClasses, el: HTMLElement) {
  el.classList.remove(...state);
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

  defineTransition(
    {
      from,
      to,
      reverse,
    }: {
      from: AnimationKeys<TStates> | '*';
      to: AnimationKeys<TStates> | '*';
      reverse?: boolean;
    },
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
        // console.log('Transition from', from, 'to', to, 'on', element);
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
          // console.log('Transition ended');
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
      processing$,
    };
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

export type AnyTransitionRecord = Record<string, AnyTransition>;

export type TransitionRecordStates<T extends AnyTransitionRecord> = {
  [K in keyof T]: AnimationKeysOf<T[K]>;
};

export type TransitionComponentProps<T extends AnyTransition> = {
  state?: ValueOrObservableOrGetter<AnimationKeysOf<T>>;
  initialState?: AnimationKeysOf<T>;
};

export type TransitionMapComponentProps<T extends AnyTransitionRecord> = {
  states?: ValueOrObservableOrGetter<TransitionRecordStates<T>>;
  initialStates?: Partial<TransitionRecordStates<T>>;
};

export function useTransitionComponent<T extends AnyTransition>(
  transitionOrMap: T,
): ComponentRenderFunc<TransitionComponentProps<T>>;
export function useTransitionComponent<T extends AnyTransitionRecord>(
  transitionOrMap: T,
): ComponentRenderFunc<TransitionMapComponentProps<T>>;
export function useTransitionComponent<
  T extends AnyTransition | AnyTransitionRecord,
>(
  transitionOrMap: T,
):
  | ComponentRenderFunc<
      TransitionComponentProps<Exclude<T, AnyTransitionRecord>>
    >
  | ComponentRenderFunc<
      TransitionMapComponentProps<Exclude<T, AnyTransition>>
    > {
  if (transitionOrMap instanceof Transition) {
    return defineComponent<
      TransitionComponentProps<Exclude<T, AnyTransitionRecord>>
    >(({ children, initialState, state }) => {
      const transition = initialState
        ? transitionOrMap.withDefault(initialState)
        : transitionOrMap;

      const state$ = ref<string>(transition.defaultState);

      // state$.subscribe((st) => {
      //   console.log('component-state is', st);
      // });
      const el$ = ref<HTMLElement>();
      const transitionProcessing$ = ref(false);
      el$.pipe(filter((el) => el != null)).subscribe(() => {
        const { bindState, processing$ } = transition.attachTo(el$);
        processing$.subscribe((p) => {
          transitionProcessing$.value = p;
        });
        bindState(state$);
        if (state) {
          setTimeout(() => {
            state$.fromObservable(toObservable(state));
          }, 16);
        }
      });
      onWaiting((done) => {
        state$.value = 'void';
        transitionProcessing$
          .pipe(
            debounceTime(16),
            filter((p) => !p),
            take(1),
          )
          .subscribe(() => {
            // console.log('transitioning to void:end');
            done();
          });
      });

      return <Capture el$={el$}>{children}</Capture>;
    });
  }
  return defineComponent<
    TransitionMapComponentProps<Exclude<T, AnyTransition>>
  >(({ children, states, initialStates }) => {
    const el$ = ref<HTMLElement>();

    const stateRefs = (() => {
      const agg: Record<string, Ref<string>> = {};
      Object.keys(transitionOrMap).forEach((key) => {
        const defaultState = initialStates
          ? initialStates[key]
          : transitionOrMap[key].defaultState;
        agg[key] = ref(defaultState);
      });
      return agg;
    })();

    const processingFlags = ref(new Map<string, boolean>());

    el$.pipe(filter((el) => el != null)).subscribe(() => {
      Object.keys(transitionOrMap).forEach((key) => {
        const defaultState = initialStates ? initialStates[key] : undefined;
        const transition = defaultState
          ? transitionOrMap[key].withDefault(defaultState)
          : transitionOrMap[key];
        const { bindState, processing$ } = transition.attachTo(el$);
        processing$.subscribe((p) => {
          processingFlags.value.set(key, p);
        });
        bindState(stateRefs[key]);
        if (states) {
          setTimeout(() => {
            toObservable(states).subscribe((so) => {
              Object.keys(so).forEach((stateKey) => {
                stateRefs[stateKey].value = so[stateKey];
              });
            });
          }, 16);
        }
      });
    });
    onWaiting((done) => {
      console.log('waiting for transition');

      Object.keys(stateRefs).forEach((key) => {
        stateRefs[key].value = 'void';
      });
      processingFlags
        .pipe(
          tap((v) => console.log(v)),
          debounceTime(16),
          filter((flags) => !Array.from(flags.values()).includes(true)),
          take(1),
        )
        .subscribe(() => {
          console.log('done');
          done();
        });
    });

    return <Capture el$={el$}>{children}</Capture>;
  });
}

