import { defineComponent, ref, h, useClasses } from '@rexar/core';
import './ClassExample.styles.css';

export const ClassExample = defineComponent(() => {
  const classes = ref(['example-card', 'rounded']);
  const isRounded = ref(false);
  return (
    <div class="example">
      <div class={() => classes.value.join(' ')}>Inline styles as string</div>
      <div class={useClasses(classes)}>Using useClasses method</div>
      <div
        class={useClasses({
          'example-card': true,
          rounded: isRounded,
        })}
      >
        Dynamic Classes (using object syntax)
      </div>
      <div
        class={useClasses([
          'example-card',
          () => (isRounded.value ? 'rounded' : ''),
        ])}
      >
        Dynamic Classes (using array syntax)
      </div>
      <button
        onClick={() => {
          isRounded.value = !isRounded.value;
        }}
      >
        Toggle rounded
      </button>
    </div>
  );
});
