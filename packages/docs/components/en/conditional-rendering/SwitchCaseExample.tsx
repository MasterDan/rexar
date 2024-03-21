import { defineComponent, ref, useSwitch, h, fragment } from '@rexar/core';

export const SwitchCaseExample = defineComponent(() => {
  const counter$ = ref(0);
  const increment = () => {
    counter$.value += 1;
  };
  const SwitchCounter = useSwitch(counter$);
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <button onClick={increment}>Counter is {counter$}</button>
      <SwitchCounter
        setup={(setCase) => {
          setCase(0, () => <>Counter equals zero</>);
          setCase(1, () => <>Counter equals one</>);
          setCase(3, () => <>Counter equals three</>);
          setCase(
            (c) => c > 10,
            () => <>Counter is greater than 10</>
          );
          setCase(
            (c) => c > 5,
            () => <>Counter is greater than 5</>
          );
        }}
        default={() => <>Counter is {counter$}</>}
      ></SwitchCounter>
    </div>
  );
});
