import { RefBase } from '../ref/base.ref';

export class BindingContext {
  private scopeStack: symbol[] = [];

  private get key() {
    return this.scopeStack.length === 0
      ? undefined
      : this.scopeStack[this.scopeStack.length - 1];
  }

  private set key(value: symbol | undefined) {
    if (value != null && this.key !== value) {
      this.scopeStack.push(value);
    } else {
      this.scopeStack.pop();
    }
  }

  private tracked: Record<symbol, symbol[]> = {};

  private trackers: Record<symbol, ((ref: RefBase) => void) | undefined> = {};

  private get tracker() {
    if (this.key == null) {
      return undefined;
    }
    return this.trackers[this.key];
  }

  private set tracker(v) {
    if (this.key) {
      this.trackers[this.key] = v;
    }
  }

  beginScope(key: symbol, fn: (ref: RefBase) => void) {
    this.key = key;
    this.tracker = fn;
    if (this.tracked[key] == null) {
      this.tracked[key] = [];
    }
    // console.log('begin scope', this.scopeStack.length);
  }

  private isTracked(ref: RefBase): boolean {
    if (this.key == null) {
      return false;
    }
    return this.tracked[this.key].some((key) => key === ref.key);
  }

  track(ref: RefBase) {
    // console.log(this.scopeStack.length, ref.getValue(), this.key, this.tracker);

    if (this.tracker == null || this.key == null) {
      throw new Error('Binding context is not defined');
    }
    if (this.isTracked(ref)) {
      return;
    }
    this.tracked[this.key].push(ref.key);
    this.tracker(ref);
  }

  endScope() {
    // console.log('end scope', this.scopeStack.length);
    this.tracker = undefined;
    this.key = undefined;
  }

  get isValid() {
    return this.key != null;
  }
}
