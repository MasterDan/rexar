import { RouterArgs, Router } from './router';

export function createRouter(args: RouterArgs): Router {
  return new Router(args);
}

