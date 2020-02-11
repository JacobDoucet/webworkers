import { ChangeDetectorRef, Component } from '@angular/core';
import { getPrimes$, } from './calculate';
import { debounceTime, map, mergeMap, tap } from 'rxjs/internal/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  N = 100000;

  num$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  height1$: Observable<string> = this.getHeightObservable$(100, 450);
  height2$: Observable<string> = this.getHeightObservable$(250, 450);
  height3$: Observable<string> = this.getHeightObservable$(300, 450);
  height4$: Observable<string> = this.getHeightObservable$(350, 450);
  height5$: Observable<string> = this.getHeightObservable$(400, 450);
  height6$: Observable<string> = this.getHeightObservable$(450, 450);

  constructor(private cd: ChangeDetectorRef) {
  }

  clear() {
    this.num$.next(null);
  }

  asyncSingleThreadDemo() {
    this.clear();
    getPrimes$(this.N).pipe(
      debounceTime(16),
      tap((i) => this.num$.next(i))
    ).subscribe();
  }

  workerDemo() {
    this.clear();

    const worker = new Worker('./prime.worker', { type: 'module' });

    worker.onmessage = ({ data }) => {
      this.num$.next(Number(data));
      this.cd.detectChanges();
    };

    worker.postMessage(`${this.N}`);
  }

  getHeightObservable$(seed: number, max: number): Observable<string> {
    return this.num$.pipe(
      map((i) => i ? `${max - ((i % seed) * max / seed)}px` : '100px')
    );
  }
}
