import {
  AnimationKeysOf,
  Show,
  computed,
  createTransition,
  defineComponent,
  ref,
  createTransitionComponent,
  useSwitch,
  useFor,
} from '@rexar/core';
import transitions from './assets/styles/transitions.module.css';
import { Input } from './input';

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

const TransitionMixed = createTransitionComponent({
  fade: transitionFade,
  rotate: transitionRotate,
});

const collapseTransition = createTransition()
  .withState('void', transitions['list-item-void'])
  .withTransition(
    { from: 'void', to: '*', reverse: true },
    transitions['list-item-transition'],
  );

const CollapseTransition = createTransitionComponent(collapseTransition);

const TransitionList = defineComponent(() => {
  const array$ = ref([1, 2, 3]);
  const Numbers = useFor(array$, (i) => i);
  return (
    <>
      <div class="flex justify-center gap-2 p-1 ">
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            array$.value.push(array$.value.length + 1);
          }}
        >
          Add new
        </button>
        <button
          class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            array$.value.reverse();
          }}
        >
          Reverse
        </button>
      </div>
      <div class="flex gap-2 items-center">
        <Numbers
          each={({ item, waiter }) => (
            <CollapseTransition waiter={waiter} initialState="void">
              <button
                class="bg-indigo-400 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
                onClick={() => {
                  array$.value = array$.value.filter((i) => i !== item.value);
                }}
              >
                Remove {item}
              </button>
            </CollapseTransition>
          )}
        />
      </div>
    </>
  );
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
  const nestedFlag1$ = ref(true);
  const nestedFlag2$ = ref(false);

  const switcher$ = ref(0);
  const Switch = useSwitch(switcher$);
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
        <TransitionMixed
          states={() => ({
            fade: fadeState$.value,
            rotate: rotateState$.value,
          })}
        >
          <div>I will fade and rotate</div>
        </TransitionMixed>
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
          content={({ waiter }) => (
            <TransitionFade waiter={waiter} initialState="void">
              <div> Flag is true </div>
            </TransitionFade>
          )}
          fallback={({ waiter }) => (
            <TransitionMixed
              waiter={waiter}
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
            </TransitionMixed>
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
          content={({ waiter }) => (
            <TransitionFade waiter={waiter} initialState="void">
              <div> Flag 1 is true </div>
            </TransitionFade>
          )}
          fallback={({ waiter: showWaiter }) => (
            <Show
              when={nestedFlag2$}
              waiter={showWaiter}
              content={({ waiter }) => (
                <TransitionFade waiter={waiter} initialState="void">
                  <div> Flag 2 is true </div>
                </TransitionFade>
              )}
              fallback={({ waiter }) => (
                <TransitionFade waiter={waiter} initialState="void">
                  <div> Flag 2 is false </div>
                </TransitionFade>
              )}
            />
          )}
        />
      </div>
      <div class="flex gap-8 items-center">
        <Input model={switcher$} label="Переключатель"></Input>
      </div>
      <div>
        <Switch
          setup={(setCase) => {
            setCase(0, ({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <div> Switcher equals Zero </div>
              </TransitionFade>
            ));
            setCase(1, ({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <div> Switcher equals One </div>
              </TransitionFade>
            ));
            setCase(
              (v) => v > 1,
              ({ waiter }) => (
                <TransitionFade waiter={waiter} initialState="void">
                  <div> Switcher is more than One </div>
                </TransitionFade>
              ),
            );
            setCase(
              (v) => v < 0,
              ({ waiter }) => (
                <TransitionFade waiter={waiter} initialState="void">
                  <div> Switcher is less than Zero </div>
                </TransitionFade>
              ),
            );
          }}
        ></Switch>
      </div>
      <div>
        <TransitionList></TransitionList>
      </div>
    </div>
  );
});

