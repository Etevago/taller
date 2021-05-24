import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../app.reducer';
import { DashboardService } from '../../dashboard/dashboard.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { contador } from './progreso.actions';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-estadistica',
  templateUrl: './progreso.component.html',
  styles: [

  ]
})
export class ProgresoComponent implements OnInit, OnDestroy {

  private unsubscribe: Subject<void> = new Subject();

  egresos: number = 0;
  totalEgresos: number = 0;
  total: number;
  contador: number = 0;
  parar: boolean;
  cita: boolean;
  reparaciones = []
  visibles = [];

  constructor(private store: Store<AppState>, private ds: DashboardService) {
  }

  ngOnInit(): void {

    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((cont) => {
        this.cita = cont.cita
        this.contador = Number(cont.cont.toFixed())
        this.reparaciones = cont.reparacion
        const x = this.contador * this.reparaciones.length / 100;
        const rep = this.reparaciones[(x) - 1];
        const repDec = this.reparaciones[Number((this.contador * this.reparaciones.length / 100).toFixed()) - 1]
        if (this.contador >= 100) {
          this.visibles = this.reparaciones
          // for (const key in this.reparaciones) {
          //   if (Object.prototype.hasOwnProperty.call(this.reparaciones, key)) {
          //     const element = this.reparaciones[key];
          //     this.visibles.push(element)
          //   }
          // }
        }
        console.log(this.visibles);
        if ((repDec != undefined) && (!this.visibles.find(param => param == repDec)) &&
          ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
          this.visibles.push(repDec);
        } else if ((rep != undefined) && (!this.visibles.find(param => param == rep)) &&
          ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
          this.visibles.push(rep);
        }

      });

  }

  reparar() {
    this.ds.crearReparacion()
    this.store.select("contador").subscribe(params => {
      this.parar = params.parar
    })

    const intervalo = setInterval(() => {

      if (this.contador >= 100) {
        this.ds.reparacionCompleta()
        this.ds.stopReparacion();
        clearInterval(intervalo);
        return 2;
      }
      else if (this.parar) {
        this.ds.stopReparacion();
        clearInterval(intervalo);
      }

      this.store.dispatch(contador())
    }, 1000)


  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
