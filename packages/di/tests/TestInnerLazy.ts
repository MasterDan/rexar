import { Lazy } from '../src/tokens/lazy';
import { TestLazyClass } from './TestLazyClass';

export class TestInnerLazy {
  val = 'foo';

  constructor(public inner: Lazy<TestLazyClass>) {}
}
