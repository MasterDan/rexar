import { BehaviorSubject } from 'rxjs';
import { RouterSeed, Router } from './router';

export const router$ = new BehaviorSubject<Router | undefined>(undefined);

export function createRouter(args: RouterSeed): Router {
  if (router$.value != null) {
    throw new Error('Router already been created');
  }
  const router = new Router(args);
  router$.next(router);
  return router;
}

