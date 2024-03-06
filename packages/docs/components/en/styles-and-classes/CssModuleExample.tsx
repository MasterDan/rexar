import { defineComponent, ref, h, useClasses } from '@rexar/core';
import styles from './CssModuleExample.module.css';

export const CssModuleExample = defineComponent(() => {
  const classes = ref([styles['example-card'], styles.rounded]);
  const isRounded = ref(false);
  return (
    <div class={styles.example}>
      <div class={() => classes.value.join(' ')}>Inline styles as string</div>
      <div class={useClasses(classes)}>Using useClasses method</div>
      <div
        class={useClasses({
          [styles['example-card']]: true,
          [styles.rounded]: isRounded,
        })}
      >
        Dynamic Classes (using object syntax)
      </div>
      <div
        class={useClasses([
          styles['example-card'],
          () => (isRounded.value ? styles.rounded : ''),
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
