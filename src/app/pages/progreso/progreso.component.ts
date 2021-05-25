import { CalendarService } from './../../services/calendar.service';
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
  reparando = false;
  egresos: number = 0;
  totalEgresos: number = 0;
  total: number;
  contador: number = 0;
  parar: boolean;
  cita: boolean;
  id: string;
  reparaciones = []
  visibles = [];

  constructor(private store: Store<AppState>, private ds: DashboardService, private calS: CalendarService) {
  }

  ngOnInit(): void {

    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((cont) => {
        this.reparando = cont.reparando
        this.id = cont.id
        this.cita = cont.cita
        this.contador = Number(cont.cont.toFixed())
        this.reparaciones = cont.reparacion
        const x = this.contador * this.reparaciones.length / 100;
        const rep = this.reparaciones[(x) - 1];
        const repDec = this.reparaciones[Number((this.contador * this.reparaciones.length / 100).toFixed()) - 1]
        if (this.contador >= 100) {
          this.visibles = this.reparaciones
          this.calS.finalizarFecha(cont.id)
        }
        if ((repDec != undefined) && (!this.visibles.find(param => param == repDec)) &&
          ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
          this.visibles.push(repDec);
          this.calS.updateVisibles(this.id, this.visibles)
        } else if ((rep != undefined) && (!this.visibles.find(param => param == rep)) &&
          ((x > (Number(x.toFixed()) - (this.reparaciones.length / 100))))) {
          this.visibles.push(rep);
          this.calS.updateVisibles(this.id, this.visibles)
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
