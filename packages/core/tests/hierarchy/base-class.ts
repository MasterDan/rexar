import { ref$ } from '@core/index';

export abstract class TestClassBase {
  private value$ = ref$<string[]>();

  public get value() {
    return this.value$.val;
  }

  public set value(v: string[] | undefined) {
    this.value$.val = v;
  }
}
