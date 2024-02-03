import { skip, take, timer } from 'rxjs';

const el = document.querySelector('div#observables');
if (el === null) {
  throw new Error('Could not find div#observables');
}
const counterObservable = timer(0, 1000).pipe(skip(1), take(9));
counterObservable.subscribe({
  next: (counter) => {
    el.innerHTML = `Counter is ${counter}`;
  },
  complete: () => {
    el.innerHTML = `We successfully counted to 10`;
  },
});
