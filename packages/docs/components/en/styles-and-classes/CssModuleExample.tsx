import { defineComponent, ref, h, useClasses } from '@rexar/core';
import styles from './CssModuleExample.module.css';

export const CssModuleExample = defineComponent(() => {
  const classes$ = ref([styles['example-card'], styles.rounded]);
  const rounded$ = ref(false);
  return (
    <div class={styles.example}>
      <span>Static Classes</span>
      <div class={() => classes$.value.join(' ')}>
        Inline classes as string
      </div>
      <div class={useClasses(classes$)}>Using useClasses method</div>
      <span>Dynamic classes ( rounded is: {rounded$} )</span>
      <div
        class={useClasses({
          [styles['example-card']]: true,
          [styles.rounded]: rounded$,
        })}
      >
        Using object syntax
      </div>
      <div
        class={useClasses([
          styles['example-card'],
          () => (rounded$.value ? styles.rounded : ''),
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
