import {
  ValueOrObservableOrGetter,
  ref,
  toObservable,
} from '@rexar/reactivity';
import { StyleAttributes } from '@rexar/jsx';
import {
  Observable,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
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

export type AnimationState =
  | {
      type: 'class';
      class: string;
    }
  | {
      type: 'style';
      style: StyleAttributes;
    };

function applyState(state: AnimationState, el: HTMLElement) {
  console.groupCollapsed('applying', state);
  console.log('element', el);

  if (state.type === 'class') {
    el.classList.add(state.class);
  } else if (state.type === 'style') {
    Object.entries(state.style).forEach(([key, value]) => {
      if (key in el.style) {
        if (value == null) {
          el.style.removeProperty(key);
        } else {
          el.style.setProperty(key, value as string | null);
        }
      }
    });
  }

  console.groupEnd();
}
function removeState(state: AnimationState, el: HTMLElement) {
  console.groupCollapsed('removing', state);
  console.log('element', el);

  if (state.type === 'class') {
    el.classList.remove(state.class);
  } else if (state.type === 'style') {
    Object.keys(state.style).forEach((key) => {
      if (
        key in el.style &&
        el.style.getPropertyValue(key) ===
          state.style[key as keyof StyleAttributes]
      ) {
        el.style.removeProperty(key);
      }
    });
  }

  console.groupEnd();
}

class Transition<TStates extends string = AnimationSatesDefault> {
  states = new Map<AnimationKeys<TStates>, AnimationState>();

  transitions = new Map<string, AnimationState>();

  defaultState: AnimationKeys<TStates> = 'default';

  setState<T extends AnimationKeys<TStates>>(state: T) {
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
    const from = (fromKey: AnimationKeys<TStates> | '*') => {
      const to = (toKey: AnimationKeys<TStates> | '*') => {
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

  withInitialSate(state: AnimationKeys<TStates>) {
    this.defaultState = state;
    return this;
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
    processing$.subscribe((v) => {
      console.log('processing is', v);
    });
    // state$.subscribe((v) => {
    //   console.log('state is', v);
    // });

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
      startWith('*'),
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
        ].filter((i): i is AnimationState => i != null);

        if (transitions.length > 0) {
          transitions.forEach((transition) => {
            applyState(transition, element);
          });
        }
        if (toState != null) {
          applyState(toState, element);
        }
        if (transitions.length === 0) {
          if (fromState != null) {
            removeState(fromState, element);
          }
          processing$.value = false;
          return;
        }

        const removeFromState = () => {
          console.log('Transition ended');
          transitions.forEach((transition) => {
            removeState(transition, element);
          });
          if (fromState != null) {
            removeState(fromState, element);
          }
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
export type AnimationKeysOf<T extends Transition<any>> = T extends Transition<
  infer TStates
>
  ? AnimationKeys<TStates>
  : never;

export function createTransition<
  TStates extends string = AnimationSatesDefault,
>() {
  return new Transition<TStates>();
}

