import { defineComponent, into, pickElement, ref$ } from '@rexar/core';
import { inner } from '../inner/inner.component';
import { inputCheckboxTest } from '../input-checkbox-test/input-checkbox-test.component';
import { inputNumberTest } from '../input-number-test/input-number-test.component';
import { inputTextTest } from '../input-text-test/input-text-test.component';
import { lorem } from '../lorem/lorem.component';
import { todoList } from '../todo-list/todo-list.component';

type Pages =
  | 'raw-template'
  | 'todo'
  | 'text-inputs'
  | 'number-inputs'
  | 'boolean-inputs'
  | 'nothing';

export const root = defineComponent({
  template: (c) => c.fromModule(() => import('./root.component.html')),
  setup: () => {
    const showContent$ = ref$<Pages>('todo');
    into('content').if(
      ref$(() => showContent$.value === 'raw-template'),
      (c) => {
        c.whenTrue.displaySelf();
        c.whenFalse.if(
          ref$(() => showContent$.value === 'todo'),
          (tdc) => {
            tdc.whenTrue.displayComponent(todoList);
            tdc.whenFalse.if(
              ref$(() => showContent$.value === 'text-inputs'),
              (tc) => {
                tc.whenTrue.displayComponent(inputTextTest);
                tc.whenFalse.if(
                  ref$(() => showContent$.value === 'number-inputs'),
                  (nc) => {
                    nc.whenTrue.displayComponent(inputNumberTest);
                    nc.whenFalse.if(
                      ref$(() => showContent$.value === 'boolean-inputs'),
                      (bc) => {
                        bc.whenTrue.displayComponent(inputCheckboxTest);
                      },
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
    pickElement('show-main-app')
      .on('click')
      .subscribe(() => {
        showContent$.value = 'raw-template';
      });
    pickElement('show-text-inputs')
      .on('click')
      .subscribe(() => {
        showContent$.value = 'text-inputs';
      });
    pickElement('show-number-inputs')
      .on('click')
      .subscribe(() => {
        showContent$.value = 'number-inputs';
      });
    pickElement('show-boolean-inputs')
      .on('click')
      .subscribe(() => {
        showContent$.value = 'boolean-inputs';
      });
    pickElement('show-todo')
      .on('click')
      .subscribe(() => {
        showContent$.value = 'todo';
      });
    into('simple-lorem-component').mountComponent(lorem);
    into('inner-component').mountComponent(inner, { message: 'Hello, World!' });
    // onMounted()
    //   .pipe(delay(1 * 10 ** 3))
    //   .subscribe(() => {
    //     showContent$.value = 'main';
    //   });
  },
});
