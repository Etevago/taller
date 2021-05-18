import { setItems } from './items.actions';
import { CalendarService } from './../services/calendar.service';
import { setContador, reparar, contador, startContador } from './../pages/progreso/progreso.actions';
import { DashboardService } from './dashboard.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  segundosActuales: number;
  segundosFB: number;
  contador: number;
  reparando: boolean;
  parar: boolean;
  calendarSubs: Subscription;

  constructor(private store: Store<AppState>, private ds: DashboardService, private calendarS: CalendarService) { }

  ngOnInit(): void {

    this.store.select("user")
      .pipe(
        takeUntil(this.unsubscribe),
        filter(auth => auth.user != null)
      )
      .subscribe(
        ({ user }) => this.calendarSubs = this.calendarS.initCalendarListener(user.uid)
          .subscribe((tallerFB: any) => {
            this.store.dispatch(setItems({ items: tallerFB }))

          })
      )

    setTimeout(() => {

      this.store.dispatch(startContador())



      this.segundosActuales = new Date().getTime()
      this.store.select("user")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(params => {
          this.segundosFB = params.user?.tiempo
          this.contador = params.user?.contador
          this.reparando = params.user?.reparando
        })

      const diferencia = (this.segundosActuales - this.segundosFB) / 1000
      this.contador += diferencia

      if (this.reparando) {
        this.store.dispatch(reparar())
        this.store.dispatch(setContador({ actual: this.contador }))
        this.store.select("contador").subscribe(params => {
          this.parar = params.parar
        })


        if (this.reparando) {
          this.store.select("contador")
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((res) => {
              this.contador = res.cont
            });
          const intervalo = setInterval(() => {
            console.log(this.contador);

            if (this.contador >= 100) {
              this.ds.reparacionCompleta()
              this.ds.stopReparacion();
              clearInterval(intervalo);
            }
            else if (this.parar) {
              this.ds.stopReparacion();
              clearInterval(intervalo);
            }

            this.store.dispatch(contador())
          }, 1000)
        }

      }
      this.store.select("user")
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(({ user }) => {
          if (user.contador >= 100) {
            this.store.dispatch(setContador({ actual: 100 }))
          }
        })
    }, 1000);


  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
