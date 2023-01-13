import { Component, OnDestroy } from '@angular/core';
import { Observable, retry, take, map, filter, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{
  public intervalSubs: Subscription;

  constructor() {


    // this.retornaObservable().pipe(
    //   retry()
    // ).subscribe({
    //   next: (valor) => console.log('en susbs: ', valor),
    //   error: (err) => console.warn('Error', err),
    //   complete: () => console.info('Obs termino')
    // }
    // );

    this.intervalSubs=this.retornaIntervalo()
      .subscribe(console.log)

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {
    return interval(100)
      .pipe(
        // take(10),
        map(valor => valor+1),
        filter(x => x % 2 === 0),
      );
  }

  retornaObservable(): Observable<number> {
    let i = -1;

    return new Observable<number>(observer => {

      const intervalo = setInterval(() => {
        i++;
        observer.next(i);

        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if (i === 2) {
          // i = 1
          observer.error('i llego a 2');
        }
      }, 1000)
    });
  }


}
