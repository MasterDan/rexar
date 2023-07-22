import { TestInner } from './TestInner';

export class TestClass {
  val = 'bar';

  constructor(public inner: TestInner) {}
}
