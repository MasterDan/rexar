import { MaybeObservable } from '@core/@types/MaybeObservable';
import {
  readonly,
  ref$,
  ReadonlyRef,
  WritableReadonlyRef,
  Ref,
} from '@rexar/reactivity';

import {
  combineLatest,
  filter,
  fromEvent,
  isObservable,
  map,
  merge,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { onBeforeUnmount } from '../lifecycle.hook';

export type ClassBinding =
  | string
  | string[]
  | Record<string, MaybeObservable<boolean>>;

export type CssProperties = Partial<CSSStyleDeclaration>;

export class ElementRef {
  nativeElement: ReadonlyRef<HTMLElement | undefined>;

  private beforeUnmount$: Subject<void>;

  constructor(ref: Ref<HTMLElement | undefined>) {
    this.nativeElement = readonly(ref);
    this.beforeUnmount$ = onBeforeUnmount();
  }

  then(handler: (arg: ElementRef) => void) {
    handler(this);
    return this;
  }

  on(...events: string[]) {
    return this.nativeElement.pipe(
      filter((el): el is HTMLElement => el != null),
      switchMap((el) => merge(...events.map((event) => fromEvent(el, event)))),
      takeUntil(this.beforeUnmount$),
    );
  }

  get bindContent() {
    const bindText = (value: MaybeObservable<string | undefined | null>) => {
      const value$ = isObservable(value) ? value : ref$(value);
      this.nativeElement
        .pipe(
          takeUntil(this.beforeUnmount$),
          filter((el): el is HTMLElement => el != null),
          switchMap((el) =>
            value$.pipe(
              filter((v): v is string => v != null),
              map((v) => ({ el, v })),
            ),
          ),
          takeUntil(this.beforeUnmount$),
        )
        .subscribe(({ el, v }) => {
          el.textContent = v;
        });
    };
    const bindHtml = (value: MaybeObservable<string | undefined | null>) => {
      const value$ = isObservable(value) ? value : ref$(value);
      this.nativeElement
        .pipe(
          takeUntil(this.beforeUnmount$),
          filter((el): el is HTMLElement => el != null),
          switchMap((el) =>
            value$.pipe(
              filter((v): v is string => v != null),
              map((v) => ({ el, v })),
            ),
          ),
          takeUntil(this.beforeUnmount$),
        )
        .subscribe(({ el, v }) => {
          el.innerHTML = v;
        });
    };

    return {
      text: bindText,
      html: bindHtml,
    };
  }

  get bindValue() {
    const validElement$ = this.nativeElement.pipe(
      filter((v): v is HTMLInputElement => v != null),
    );
    const bindText = (
      value$:
        | Ref<string | undefined>
        | Ref<string>
        | WritableReadonlyRef<string>
        | WritableReadonlyRef<string | undefined>,
    ) => {
      const valueChanged$ = validElement$.pipe(
        takeUntil(this.beforeUnmount$),
        switchMap((el) =>
          merge(
            fromEvent(el, 'change'),
            fromEvent(el, 'keydown'),
            fromEvent(el, 'paste'),
            fromEvent(el, 'input'),
          ),
        ),
        map((e) => e.target),
        filter((t): t is HTMLInputElement => t != null),
        map((t) => t.value),
        filter((v) => v !== value$.value),
        takeUntil(this.beforeUnmount$),
      );
      valueChanged$.subscribe((val) => {
        value$.value = val;
      });

      combineLatest([validElement$, value$])
        .pipe(
          filter((arr): arr is [HTMLInputElement, string] => {
            const [el, val] = arr;
            return val != null && el.value !== val;
          }),
        )
        .subscribe(([el, v]) => {
          el.value = v;
        });
    };
    const bindNumber = (value$: Ref<number | undefined> | Ref<number>) => {
      const stringified$ = ref$<string | undefined>(String(value$.value));

      const reverseNumber$ = ref$(() => {
        const num = Number(stringified$.value);

        return Number.isNaN(num) ? undefined : num;
      });

      (value$ as Ref<number | undefined>)
        .pipe(filter((v) => v !== reverseNumber$.value))
        .subscribe((v) => {
          stringified$.value = String(v);
        });
      reverseNumber$
        .pipe(filter((rn) => rn !== value$.value))
        .subscribe((rn) => {
          value$.value = rn;
        });
      bindText(stringified$);
    };

    const bindBoolean = (value$: Ref<boolean>) => {
      const valueChanged$ = validElement$.pipe(
        takeUntil(this.beforeUnmount$),
        switchMap((el) => merge(fromEvent(el, 'change'))),
        takeUntil(this.beforeUnmount$),
        map((e) => e.target),
        filter((t): t is HTMLInputElement => t != null),
        map((t) => t.checked),
        filter((v) => v !== value$.value),
      );

      valueChanged$.subscribe((val) => {
        value$.value = val;
      });

      combineLatest([validElement$, value$])
        .pipe(
          filter((arr): arr is [HTMLInputElement, boolean] => {
            const [el, val] = arr;
            return val != null && el.checked !== val;
          }),
        )
        .subscribe(([el, v]) => {
          el.checked = v;
        });
    };

    return {
      string: bindText,
      number: bindNumber,
      boolean: bindBoolean,
    };
  }

  bindClass(value: MaybeObservable<ClassBinding>) {
    const validElement$ = this.nativeElement.pipe(
      filter((v): v is HTMLElement => v != null),
    );
    const value$ = isObservable(value) ? value : ref$(value);

    const class$ = value$.pipe(
      switchMap((v) => {
        if (typeof v === 'string') {
          return of(v);
        }
        if (Array.isArray(v)) {
          return of(v.join(' '));
        }
        const checks = Object.keys(v).map((i) => {
          const check = v[i];
          const check$ = isObservable(check) ? check : of(check);
          return check$.pipe(map((c) => (c ? i : null)));
        });
        return combineLatest(checks).pipe(
          map((classes) => classes.filter((c) => c != null).join(' ')),
        );
      }),
    );

    let classesFromTemplate: string | undefined;

    combineLatest([validElement$, class$]).subscribe(
      ([element, classValue]) => {
        if (classesFromTemplate == null) {
          classesFromTemplate = element.getAttribute('class') ?? '';
        }
        element.setAttribute(
          'class',
          [classesFromTemplate, classValue].join(' ').trim(),
        );
      },
    );
  }

  bindStyle(style: MaybeObservable<CssProperties | string>) {
    const validElement$ = this.nativeElement.pipe(
      filter((v): v is HTMLElement => v != null),
    );
    const style$ = isObservable(style) ? style : ref$(style);
    let templateStyle: string | null | undefined;
    combineLatest([validElement$, style$]).subscribe(([elem, styleVal]) => {
      if (typeof styleVal === 'string') {
        if (templateStyle === undefined) {
          templateStyle = elem.getAttribute('style');
        }
        elem.setAttribute(
          'style',
          [templateStyle, styleVal]
            .filter((x) => x != null)
            .join(' ')
            .trim(),
        );
      } else {
        Object.keys(styleVal).forEach((k) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion
          elem.style[k as any] = styleVal[k as any]!;
        });
      }
    });
  }
}
