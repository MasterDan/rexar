import { Subject, combineLatest, lastValueFrom, take } from 'rxjs';

export class Waiter {
  private imWaiting$ = new Subject<void>();

  private targets = new Set<Subject<void>>();

  public waitForMe(handler: (done: () => void) => void) {
    const imDone$ = new Subject<void>();
    this.targets.add(imDone$);
    this.imWaiting$.pipe(take(1)).subscribe(() =>
      handler(() => {
        imDone$.next();
      }),
    );
  }

  public async waitEveryone(): Promise<void> {
    const done$ = new Subject<void>();
    const donePromise = lastValueFrom(done$);
    const done = () => {
      done$.next();
      done$.complete();
    };

    if (this.targets.size === 0) {
      done();
    } else {
      combineLatest(Array.from(this.targets)).subscribe(done);
      this.imWaiting$.next();
    }
    return donePromise;
  }
}

