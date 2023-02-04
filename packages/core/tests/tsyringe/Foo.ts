import { injectable } from 'tsyringe';

@injectable()
export class Foo {
  prefix = 'Foo said: ';

  say(message: string) {
    return this.prefix + message;
  }
}
