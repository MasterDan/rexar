import { AnyRecord } from '@rexar/tools';
import { Observable, Subject, filter } from 'rxjs';

export type Hook<TBody = () => void> = {
  key: symbol;
  name: string;
  body: TBody;
};

export class Scope<T, THooks extends AnyRecord<string>> {
  private stack: symbol[] = [];

  private values: Map<symbol, T> = new Map();

  private hookCatcher = new Subject<Hook<THooks[keyof THooks]>>();

  get current() {
    if (this.stack.length === 0) {
      return undefined;
    }
    const key = this.stack[this.stack.length - 1];
    const value = this.values.get(key);
    if (value == null) {
      throw new Error('Cannot get scope value');
    }
    return { key, value };
  }

  begin(key: symbol, value: T): Observable<Hook<THooks[keyof THooks]>> {
    this.stack.push(key);
    this.values.set(key, value);
    return this.hookCatcher.pipe(filter((hook) => hook.key === key));
  }

  end() {
    if (this.stack.length === 0) {
      return;
    }
    const key = this.stack.pop();
    if (key) {
      this.values.delete(key);
    }
  }

  createHook<TKey extends keyof THooks & string>(name: TKey) {
    return (body: THooks[TKey]) => {
      const currentScope = this.current;
      if (currentScope == null) {
        return;
      }
      this.hookCatcher.next({
        body,
        key: currentScope.key,
        name,
      });
    };
  }
}
