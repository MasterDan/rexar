import { Observable } from 'rxjs';
import { ref$ } from '@/reactivity/ref/index';

export interface IComponentPropsDefinition {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: Observable<any>;
}

export class Component<TProps> {
  id?: string;

  name?: string;

  constructor(protected props: TProps) {}
}

const test = new Component({ foo: ref$('bar') });
