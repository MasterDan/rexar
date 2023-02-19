import { singleton } from 'tsyringe';
import { RefBase } from '../ref/base.ref';

@singleton()
export class BindingContext {
  private key: symbol | undefined;

  private tracked: Record<symbol, symbol[]> = {};

  private tracker: ((ref: RefBase) => void) | undefined;

  init(key: symbol, fn: (ref: RefBase) => void) {
    this.key = key;
    this.tracker = fn;
    if (this.tracked[key] == null) {
      this.tracked[key] = [];
    }
  }

  private isTracked(ref: RefBase): boolean {
    if (this.key == null) {
      return false;
    }
    return this.tracked[this.key].find((key) => key === ref.key) != null;
  }

  track(arg: RefBase) {
    if (this.tracker == null || this.key == null) {
      throw new Error('Binding context is not defined');
    }
    if (this.isTracked(arg)) {
      return;
    }
    this.tracked[this.key].push(arg.key);
    this.tracker(arg);
  }

  cleanContext() {
    this.key = undefined;
    this.tracker = undefined;
  }

  get isValid() {
    return this.key != null;
  }
}
