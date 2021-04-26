import { DashboardService } from './../../dashboard/dashboard.service';
import { AppStateIngreso } from './../ingreso-egreso.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { contadorReducer } from './estadistica.reducer';
import { contador } from './estadistica.actions';
import { takeUntil } from 'rxjs/operators';
import { interval, timer } from 'rxjs';


@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [

  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  total: number;
  contador: number = 0;
  parar: boolean;


  constructor(private store: Store<AppStateIngreso>, private ds: DashboardService) {
  }

  ngOnInit(): void {

    this.store.select("ingresosEgresos").subscribe(({ items }: any) => {
      this.generarEstadistica(items)
    })

    this.store.select("contador").subscribe(({ cont }) => {
      this.contador = cont;
    })

  }

  generarEstadistica(items: (IngresoEgreso[] | any)) {
    for (const item of items) {
      if (item.data.tipo === "ingreso") {
        this.totalIngresos += item.data.cantidad
        this.ingresos++;
      } else {
        this.totalEgresos += item.data.cantidad
        this.egresos++;
      }
    }
    this.total = this.totalIngresos - this.totalEgresos

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

      console.log("sumando funcion");
      this.store.dispatch(contador())
    }, 1000)


  }


}
