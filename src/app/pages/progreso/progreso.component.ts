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


  constructor(private store: Store<AppState>, private ds: DashboardService) {
  }

  ngOnInit(): void {
    this.store.select("contador")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.cita = res.cita
        this.contador = res.cont
      });

  }



  reparar() {
    this.ds.crearReparacion()
    this.store.select("contador").subscribe(params => {
      this.parar = params.parar
    })

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

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }


}
