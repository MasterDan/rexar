import {
  AnimationKeysOf,
  computed,
  createTransition,
  defineComponent,
  ref,
} from '@rexar/core';

const fade = createTransition()
  .setState('default')
  .withStyle({
    opacity: '1',
    transform: undefined,
  })
  .setState('void')
  .withStyle({ opacity: '0' })
  .addState('rotated')
  .withStyle({ transform: 'rotate(45deg)' })
  .setTransition.from('*')
  .to('rotated')
  .withStyle({
    transition: 'transform 0.5s ease-in-out',
  })
  .setTransition.from('rotated')
  .to('*')
  .withStyle({
    transition: 'transform 0.5s ease-in-out',
  })
  .setTransition.from('void')
  .to('*')
  .withStyle({
    transition: 'opacity 0.2s ease-in-out',
  })
  .setTransition.from('*')
  .to('void')
  .withStyle({
    transition: 'opacity 0.3s ease-in-out',
  })
  .withInitialSate('void');

const TransitionFade = fade.createComponent();

export const TransitionTest = defineComponent(() => {
  const visible$ = ref(false);
  const rotated$ = ref(false);
  const state$ = computed<AnimationKeysOf<typeof fade>>(() => {
    if (visible$.value) {
      if (rotated$.value) {
        return 'rotated';
      }
      return 'default';
    }
    return 'void';
  });
  rotated$.subscribe((rotated) => {
    console.log('rotated', rotated);
  });
  state$.subscribe((state) => {
    console.log('state', state);
  });
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
          class="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-500 
        text-white p-2 px-4 rounded-full transition-colors duration-200"
          onClick={() => {
            rotated$.value = !rotated$.value;
          }}
          disabled={() => !visible$.value}
        >
          Toggle rotated
        </button>
      </div>
      <TransitionFade state={state$}>
        <div>Hello World</div>
      </TransitionFade>
    </div>
  );
});

