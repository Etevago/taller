import { setContador, reparar, contador, stopReparar, startContador } from './../ingreso-egreso/estadistica/estadistica.actions';
import { DashboardService } from './dashboard.service';
import { setItems } from './../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  sub: Subscription;
  ingresosSubs: Subscription;
  segundosActuales: number;
  segundosFB: number;
  contador: number;
  reparando: boolean;
  parar: boolean;

  constructor(private store: Store<AppState>, private ies: IngresoEgresoService, private ds: DashboardService) { }

  ngOnInit(): void {

    this.sub = this.store.select("user")
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(
        ({ user }) => this.ingresosSubs = this.ies.initIngresoEgresoListener(user.uid)
          .subscribe((ingresosEgresosFB: any) => {
            this.store.dispatch(setItems({ items: ingresosEgresosFB }))
          })
      );
    setTimeout(() => {

      this.store.dispatch(startContador())

      this.segundosActuales = new Date().getTime()
      this.store.select("user").subscribe(params => {
        this.segundosFB = params.user.tiempo
      })
      this.store.select("user").subscribe(params => {
        this.contador = params.user.contador
      })

      const diferencia = (this.segundosActuales - this.segundosFB) / 1000
      this.contador += diferencia



      this.store.select("user").subscribe(params => {
        this.reparando = params.user.reparando
      })

      if (this.reparando) {
        this.store.dispatch(reparar())
        this.store.dispatch(setContador({ actual: this.contador }))

        this.store.select("contador").subscribe(params => {
          this.parar = params.parar
        })


        setInterval(() => {
          if (this.contador >= 100) {
            this.ds.stopReparacion();
            return;
          }
          else if (this.parar) {
            return;
          }
          console.log("sumando dashboard");
          this.store.dispatch(contador())
        }, 1000)

      }
    }, 1000);


  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.ingresosSubs?.unsubscribe()
  }


}
