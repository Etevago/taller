import { CitaService } from './../services/cita.service';
import { setCalendar, setCitas } from './items.actions';
import { CalendarService } from './../services/calendar.service';
import { setContador, reparar, contador, startContador, setUser, setReparaciones } from './../pages/progreso/progreso.actions';
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
  reparaciones = [];
  constructor(private store: Store<AppState>, private ds: DashboardService, private calendarS: CalendarService, private citaS: CitaService) { }

  ngOnInit(): void {

    this.store.select("user")
    .pipe(
      takeUntil(this.unsubscribe),
      filter(auth => auth.user != null)
    )
    .subscribe(
      ({ user }) => {
        this.calendarS.initCalendarListener(user.uid)
          .subscribe((calendar: any) => {
            this.store.dispatch(setCalendar({ items: calendar }))
            this.store.dispatch(setUser({ user: user.uid }))
          })

        this.citaS.initCitaListener(user.uid)
          .subscribe((citas: any) => {
            this.store.dispatch(setCitas({ items: citas }))
          })

          this.segundosFB = user?.tiempo
          this.contador = user?.contador
          this.reparando = user?.reparando
          if (user.contador >= 100) {
            this.store.dispatch(setContador({ actual: 100 }))
          }
      }
    )

    setTimeout(() => {
    this.store.dispatch(startContador())

    this.store.select("items")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ reparaciones }) => {
        if (reparaciones.length > 0) {
          this.reparaciones = reparaciones
          this.reparaciones = this.reparaciones[0].data
          const pasar = [];
          Object.keys(this.reparaciones).forEach(key => {
            const data = {}
            data[key] = this.reparaciones[key]
            pasar.push(data)
          })
          this.store.dispatch(setReparaciones({ reparacion: pasar }))
        }
      })

    this.segundosActuales = new Date().getTime()
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
  }, 1000);

  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
