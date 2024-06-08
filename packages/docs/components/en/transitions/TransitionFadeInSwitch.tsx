import { defineComponent, ref, useSwitch } from '@rexar/core';

import { TransitionFade } from './fade.transition';

export const TransitionFadeInSwitch = defineComponent(() => {
  const number$ = ref(0);

  const NumberSwitch = useSwitch(number$);
  return (
    <>
      <h4>Change the number and see the animation</h4>
      <input
        type="number"
        value={number$}
        onInput={(e) => {
          number$.value = +(e.target as HTMLInputElement).value;
        }}
      ></input>
      <NumberSwitch
        setup={(setCase) => {
          setCase(
            (v) => v < 0,
            ({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <span>Number is less than Zero</span>
              </TransitionFade>
            )
          );
          setCase(0, ({ waiter }) => (
            <TransitionFade waiter={waiter} initialState="void">
              <span>Number is Zero</span>
            </TransitionFade>
          ));
          setCase(1, ({ waiter }) => (
            <TransitionFade waiter={waiter} initialState="void">
              <span>Number is One</span>
            </TransitionFade>
          ));
          setCase(
            (v) => v > 1,
            ({ waiter }) => (
              <TransitionFade waiter={waiter} initialState="void">
                <span>Number is more than One</span>
              </TransitionFade>
            )
          );
        }}
      />
    </>
  );
});
