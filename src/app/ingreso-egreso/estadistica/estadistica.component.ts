import { AppStateIngreso } from './../ingreso-egreso.reducer';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';


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



  constructor(private store: Store<AppStateIngreso>) {
  }

  ngOnInit(): void {
    this.store.select("ingresosEgresos").subscribe(({ items }: any) => {
      this.generarEstadistica(items)
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




}
