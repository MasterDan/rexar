import { defineComponent } from '@core/components';
import { useElement } from '@core/components/builtIn/custom/hooks/custom-component-hooks';
import { filter } from 'rxjs';
// @ts-expect-error importing html
import template from './test-two.component.html';

export const testTwo = defineComponent({
  template,
  setup() {
    useElement('#middle')
      .pipe(filter((x): x is HTMLElement => x != null))
      .subscribe((el) => {
        el.innerHTML = 'middle text';
      });
  },
});
