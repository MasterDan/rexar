import {
  defineComponent,
  ref,
  fragment,
  h,
  StyleAttributes,
  computed,
} from '@rexar/core';

export const StylesExample = defineComponent(() => {
  const bgColor$ = ref('red');
  const toggleColor = () => {
    bgColor$.value = bgColor$.value === 'red' ? 'blue' : 'red';
  };
  const divStyle$ = computed<StyleAttributes>(() => ({
    backgroundColor: bgColor$.value,
    padding: '1rem',
    borderRadius: '1rem',
    transition: 'background-color 0.5s',
  }));
  return (
    <>
      <div
        style={() => ({
          backgroundColor: bgColor$.value,
          padding: '1rem',
          borderRadius: '1rem',
          transition: 'background-color 0.5s',
        })}
      ></div>
      <div style={divStyle$}></div>
      <button onClick={toggleColor}>Toggle color</button>
    </>
  );
});
