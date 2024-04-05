import { defineComponent } from '@rexar/core';
import { Observable } from 'rxjs';

// Simple component that we're going to import as LazyComponent
export const Message = defineComponent<{ message$: Observable<string> }>(
  ({ message$ }) => <div>{message$}</div>
);
