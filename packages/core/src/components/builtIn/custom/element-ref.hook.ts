import { ref$ } from '@core/reactivity/ref';
import { ElementReference } from '@core/render/html/ref-store/element.reference';
import { filter } from 'rxjs';

export class ElementRefHook {
  constructor(
    public el$ = ref$<ElementReference>(),
    public hook: ((r: ElementReference) => void) | undefined = undefined,
  ) {
    this.el$
      .pipe(filter((ref): ref is NonNullable<typeof ref> => ref != null))
      .subscribe((val) => {
        if (this.hook) {
          this.hook(val);
        }
      });
  }
}
