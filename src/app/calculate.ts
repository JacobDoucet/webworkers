import { Observable, Observer } from 'rxjs';

export function getPrimes$(n: number) {
  return new Observable<number>(($: Observer<number>) => {
    let i = 2500000;
    let found = 0;

    while (found < n) {
      if (checkPrime(i)) {
        found += 1;
        $.next(i);
      }
      i += 1;
    }

    $.complete();
  });
}

export function checkPrime(i: number) {
  let prime = true;
  for (let j = 2; j < Math.floor(Math.sqrt(i)); j += 1) {
    if (i % j === 0) {
      prime = false;
    }
  }
  return prime;
}
