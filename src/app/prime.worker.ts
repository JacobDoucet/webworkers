/// <reference lib="webworker" />

import { getPrimes$ } from './calculate';
import { tap } from 'rxjs/internal/operators';

addEventListener('message', ({data}) => {
  getPrimes$(Number(data)).pipe(
    tap((i) => postMessage(`${i}`))
  ).subscribe();
});
