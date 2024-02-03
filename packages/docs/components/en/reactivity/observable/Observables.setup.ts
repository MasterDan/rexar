import { skip, take, timer } from 'rxjs';

export function setup() {
  const el = document.querySelector('div#observables');
  const counterObservable = timer(0, 1000).pipe(skip(1), take(9));
  counterObservable.subscribe({
    next: (counter) => {
      el!.innerHTML = `Counter is ${counter}`;
    },
    complete: () => {
      el!.innerHTML = `We successfully counted to 10`;
    },
  });
}
