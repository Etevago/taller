import { AppState } from './../../app.reducer';
import { DashboardService } from './../../dashboard/dashboard.service';
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


  constructor(private store: Store<AppState>, private ds: DashboardService) {
  }

  ngOnInit(): void {


     this.store.select("contador").subscribe(({ cont }) => {
       this.contador = cont;
     })

    // this.store.select("user").subscribe(({ user }) => {
    //   this.contador = user.contador
    // })

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
