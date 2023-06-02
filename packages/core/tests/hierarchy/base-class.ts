import { ref$ } from '@core/index';

export abstract class TestClassBase {
  private value$ = ref$<string[]>();

  public get value() {
    return this.value$.value;
  }

  public set value(v: string[] | undefined) {
    this.value$.value = v;
  }
}

