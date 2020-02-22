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

  bars: { n: number, height$: Observable<string>, class: string}[] = [];

  constructor(private cd: ChangeDetectorRef) {
    this.bars = [
      { n: 100, height$: this.getHeightObservable$(100), class: 'light' },
      { n: 250, height$: this.getHeightObservable$(250), class: 'secondary' },
      { n: 300, height$: this.getHeightObservable$(300), class: 'primary' },
      { n: 350, height$: this.getHeightObservable$(350), class: 'info' },
      { n: 400, height$: this.getHeightObservable$(400), class: 'success' },
      { n: 450, height$: this.getHeightObservable$(450), class: 'warning' },
      { n: 550, height$: this.getHeightObservable$(550), class: 'danger' }
    ];
  }

  clear() {
    this.num$.next(null);
  }

  asyncSingleThreadDemo() {
    this.clear();
    setTimeout(() => {
      getPrimes$(this.N).pipe(
        tap((i) => this.num$.next(i))
      ).subscribe();
    }, 10);
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

  private getHeightObservable$(seed: number): Observable<string> {
    return this.num$.pipe(
      map((i) => i ? `${400 - Math.round((i % seed) * 400 / seed)}px` : '100px')
    );
  }
}
