import {
  AnimationKeysOf,
  Show,
  computed,
  createTransition,
  defineComponent,
  ref,
  createTransitionComponent,
} from '@rexar/core';
import transitions from './assets/styles/transitions.module.css';

const transitionFade = createTransition()
  .withState('default', transitions['opacity-one'])
  .withState('void', transitions['opacity-zero'])
  .withTransition(
    { from: 'void', to: 'default' },
    transitions['transition-opacity-in'],
  )
  .withTransition(
    { from: 'default', to: 'void' },
    transitions['transition-opacity-out'],
  );

const transitionRotate = createTransition()
  .withState('rotated', transitions.rotated)
  .withTransition(
    { from: 'rotated', to: '*', reverse: true },
    transitions['transition-rotate'],
  );

const TransitionFade = createTransitionComponent(transitionFade);

const TransitionRotate = createTransitionComponent(transitionRotate);

const TransitionFadeAndRotate = createTransitionComponent({
  fade: transitionFade,
  rotate: transitionRotate,
});

export const TransitionTest = defineComponent(() => {
  const visible$ = ref(true);
  const rotated$ = ref(false);
  const fadeState$ = computed<AnimationKeysOf<typeof transitionFade>>(() => {
    if (visible$.value) {
      return 'default';
    }
    return 'void';
  });
  const rotateState$ = computed<AnimationKeysOf<typeof transitionRotate>>(
    () => {
      if (rotated$.value) {
        return 'rotated';
      }
      return 'default';
    },
  );
  const flag$ = ref(true);
  const nestedFlag1$ = ref(false);
  const nestedFlag2$ = ref(false);
  return (
    <div class="bg-neutral-50 p-8 rounded-3xl bg-opacity-30 flex flex-col gap-8 items-center">
      <div class="flex gap-8 justify-between items-center">
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            visible$.value = !visible$.value;
          }}
        >
          Toggle opacity
        </button>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            rotated$.value = !rotated$.value;
          }}
        >
          Toggle rotated
        </button>
      </div>
      <div class="flex gap-8 justify-between items-center">
        <TransitionFade state={fadeState$}>
          <div>I will fade</div>
        </TransitionFade>
        <TransitionRotate state={rotateState$}>
          <div>I will rotate</div>
        </TransitionRotate>
        <TransitionFadeAndRotate
          states={() => ({
            fade: fadeState$.value,
            rotate: rotateState$.value,
          })}
        >
          <div>I will fade and rotate</div>
        </TransitionFadeAndRotate>
      </div>
      <div class="flex gap-8 items-center">
        <h2 class="text-lg">Transitions inside show component</h2>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            flag$.value = !flag$.value;
          }}
        >
          Toggle
        </button>
      </div>
      <div>
        <Show
          when={flag$}
          content={() => (
            <TransitionFade state="default" initialState="void">
              <div> Flag is true </div>
            </TransitionFade>
          )}
          fallback={() => (
            <TransitionFadeAndRotate
              states={{
                fade: 'default',
                rotate: 'rotated',
              }}
              initialStates={{
                fade: 'void',
                rotate: 'void',
              }}
            >
              <div> Flag is false </div>
            </TransitionFadeAndRotate>
          )}
        />
      </div>
      <div class="flex gap-8 items-center">
        <h2 class="text-lg">Transitions inside Nested show component</h2>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            nestedFlag1$.value = !nestedFlag1$.value;
          }}
        >
          Toggle First Flag
        </button>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            nestedFlag2$.value = !nestedFlag2$.value;
          }}
        >
          Toggle Second Flag
        </button>
      </div>
      <div>
        <Show
          when={nestedFlag1$}
          content={() => (
            <TransitionFade state="default" initialState="void">
              <div> Flag 1 is true </div>
            </TransitionFade>
          )}
          fallback={() => (
            <Show
              when={nestedFlag2$}
              content={() => (
                <TransitionFade state="default" initialState="void">
                  <div> Flag 2 is true </div>
                </TransitionFade>
              )}
              fallback={() => (
                <TransitionFade state="default" initialState="void">
                  <div> Flag 2 is false </div>
                </TransitionFade>
              )}
            />
          )}
        ></Show>
      </div>
    </div>
  );
});

