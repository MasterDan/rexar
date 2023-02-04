import { singleton } from 'tsyringe';
import { Foo } from './Foo';

@singleton()
export class Bar {
  constructor(private foo: Foo) {}

  test() {
    return this.foo.say('Hello from bar');
  }
}
