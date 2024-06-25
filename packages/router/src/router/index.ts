import { RouterSeed, Router } from './router';

export function createRouter(args: RouterSeed): Router {
  return new Router(args);
}

