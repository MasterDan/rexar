import { defineComponent, ref, useClasses } from '@rexar/core';
import './ClassExample.styles.css';

export const ClassExample = defineComponent(() => {
  const classes = ['example-card', 'rounded'];
  const rounded$ = ref(false);
  return (
    <div class="example">
      <span>Static Classes</span>
      <div class={() => classes.join(' ')}>Inline classes as string</div>
      <div class={useClasses(classes)}>Using useClasses method</div>
      <span>Dynamic classes ( rounded is: {rounded$} )</span>
      <div
        class={useClasses({
          'example-card': true,
          rounded: rounded$,
        })}
      >
        Using object syntax
      </div>
      <div
        class={useClasses([
          'example-card',
          () => (rounded$.value ? 'rounded' : ''),
        ])}
      >
        Using array syntax
      </div>
      <button
        onClick={() => {
          rounded$.value = !rounded$.value;
        }}
      >
        Toggle rounded
      </button>
    </div>
  );
});
