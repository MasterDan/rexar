import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';

import {
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  take,
} from 'rxjs';
import { ComponentRenderFunc, defineComponent } from '@core/component';
import { onMounted } from '@core/scope';
import { Capture } from '../capture/Capture';
import { onWaiting } from '../dynamic/waiting';

export type AnimationSatesDefault = 'default' | 'void';

export type AnimationKeys<
  TAdditionalKeys extends string = AnimationSatesDefault,
> = AnimationSatesDefault | TAdditionalKeys;

export type AnimationClasses = string[];

function applyState(state: AnimationClasses, el: HTMLElement) {
  if (state.length === 0) return;
  el.classList.add(...state);
}
function removeState(state: AnimationClasses, el: HTMLElement) {
  if (state.length === 0) return;
  el.classList.remove(...state);
}

class Transition<TStates extends string = AnimationSatesDefault> {
  states = new Map<AnimationKeys<TStates>, AnimationClasses>();

  transitions = new Map<string, AnimationClasses>();

  defaultState: AnimationKeys<TStates> = 'default';

  withState<T extends AnimationKeys<TStates>>(
    state: T,
    ...classes: string[]
  ): Transition<TStates>;
  withState<T extends string>(
    state: T,
    ...classes: string[]
  ): Transition<TStates | T>;
  withState<T extends AnimationKeys<TStates> | string>(
    state: T,
    ...classes: string[]
  ): Transition<TStates | T> {
    const self = this as Transition<TStates | T>;
    self.states.set(state, classes);
    return self;
  }

  withTransition(
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

export function attachTransitions<TTransitions extends AnyTransitionRecord>(
  transitions: TTransitions,
) {
  const to = (el$: ValueOrObservableOrGetter<HTMLElement | undefined>) => {
    const transitionNames = Object.keys(transitions);
    const element$ = toObservable(el$).pipe(
      filter((v): v is HTMLElement => v != null),
    );

    const states$ = ref(
      new Map<string, string>(
        transitionNames.map((name) => [name, transitions[name].defaultState]),
      ),
    );
    const processing$ = ref(true);

    // applying initial state classes to element
    states$
      .pipe(combineLatestWith(element$), take(1))
      .subscribe(([states, element]) => {
        const initState = [...states]
          .map(([name, state]) => transitions[name].states.get(state))
          .filter((i): i is AnimationClasses => i != null)
          .reduce((a, b) => a.concat(b), []);
        applyState(initState, element);
        processing$.value = false;
      });
    // applying transitions
    states$
      .pipe(
        distinctUntilChanged((a, b) => {
          if (a.size !== b.size) return false;
          // eslint-disable-next-line no-restricted-syntax
          for (const [key, val] of a) {
            const item = b.get(key);
            if (item !== val || (item === undefined && !b.has(key))) {
              return false;
            }
          }
          return true;
        }),
        pairwise(),
        map(([fromStates, toStates]) => ({ fromStates, toStates })),
        combineLatestWith(element$),
      )
      .subscribe(([{ fromStates, toStates }, element]) => {
        processing$.value = true;
        const fromClasses = [...fromStates]
          .map(([name, state]) => transitions[name].states.get(state))
          .filter((i): i is AnimationClasses => i != null)
          .reduce((a, b) => a.concat(b), []);
        const toClasses = [...toStates]
          .map(([name, state]) => transitions[name].states.get(state))
          .filter((i): i is AnimationClasses => i != null)
          .reduce((a, b) => a.concat(b), []);
        const transitionClasses = transitionNames
          .map((name) => {
            const transition = transitions[name];
            const fromKey = fromStates.get(name);
            const toKey = toStates.get(name);
            const directKey = transition.transitions.get(
              `${fromKey}=>${toKey}`,
            );
            if (directKey != null) return directKey;
            const partialKeys = [
              transition.transitions.get(`${fromKey}=>*`),
              transition.transitions.get(`*=>${toKey}`),
            ]
              .filter((i): i is AnimationClasses => i != null)
              .reduce((a, b) => a.concat(b), []);
            if (partialKeys.length > 0) return partialKeys;
            return transition.transitions.get('*=>*') ?? [];
          })
          .reduce((a, b) => a.concat(b), []);

        applyState([...transitionClasses, ...toClasses], element);
        removeState(fromClasses, element);

        if (transitionClasses.length === 0) {
          processing$.value = false;
          return;
        }

        const removeFromState = () => {
          removeState(transitionClasses, element);
          element.removeEventListener('transitionend', removeFromState);
          processing$.value = false;
        };
        element.addEventListener('transitionend', removeFromState);
      });

    const bindStates = (
      stateToBind$: ValueOrObservableOrGetter<
        TransitionRecordStates<TTransitions>
      >,
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
        .subscribe((states) => {
          states$.value = new Map(
            transitionNames.map((name) => [name, states[name]]),
          );
        });
    };
    return { bindStates, processing$: processing$.asObservable() };
  };
  return { to };
}

export type TransitionComponentProps<T extends AnyTransition> = {
  state?: ValueOrObservableOrGetter<AnimationKeysOf<T>>;
  initialState?: AnimationKeysOf<T>;
};

export type TransitionMapComponentProps<T extends AnyTransitionRecord> = {
  states?: ValueOrObservableOrGetter<TransitionRecordStates<T>>;
  initialStates?: Partial<TransitionRecordStates<T>>;
};

export function createTransitionComponent<T extends AnyTransition>(
  transitionOrMap: T,
): ComponentRenderFunc<TransitionComponentProps<T>>;
export function createTransitionComponent<T extends AnyTransitionRecord>(
  transitionOrMap: T,
): ComponentRenderFunc<TransitionMapComponentProps<T>>;
export function createTransitionComponent<
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

      const el$ = ref<HTMLElement>();

      const { bindStates, processing$ } = attachTransitions({
        default: transition,
      }).to(el$);

      bindStates(state$.pipe(map((s) => ({ default: s }))));

      onMounted().subscribe(() => {
        if (state) {
          state$.fromObservable(toObservable(state));
        }
      });
      onWaiting((done) => {
        state$.value = 'void';
        processing$
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

    const states$ = (() => {
      const agg = ref<Record<string, string>>({});
      Object.keys(transitionOrMap).forEach((key) => {
        const defaultState = initialStates
          ? initialStates[key]
          : transitionOrMap[key].defaultState;
        agg.value[key] = defaultState;
      });
      return agg;
    })();

    const { bindStates, processing$ } =
      attachTransitions(transitionOrMap).to(el$);
    bindStates(states$);

    onMounted().subscribe(() => {
      if (states) {
        states$.fromObservable(toObservable(states));
      }
    });

    onWaiting((done) => {
      console.log('waiting for transition');
      const voidState: Record<string, string> = {};
      Object.keys(transitionOrMap).forEach((key) => {
        voidState[key] = 'void';
      });
      states$.value = voidState;
      processing$
        .pipe(
          debounceTime(16),
          filter((p) => !p),
          take(1),
        )
        .subscribe(() => {
          done();
          console.log('done');
        });
    });

    return <Capture el$={el$}>{children}</Capture>;
  });
}

