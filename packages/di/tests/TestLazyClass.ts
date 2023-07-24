import { Lazy } from '../src/tokens/lazy';
import { TestInnerLazy } from './TestInnerLazy';

export class TestLazyClass {
  val = 'bar';

  constructor(public inner: Lazy<TestInnerLazy>) {}
}
