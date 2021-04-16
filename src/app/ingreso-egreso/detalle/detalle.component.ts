import { AppStateIngreso } from './../ingreso-egreso.reducer';
import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import { Subscription } from 'rxjs';
import { unSetItems } from './../ingreso-egreso.actions';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresosEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(private store: Store<AppStateIngreso>, private ies: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosSubs = this.store.select("ingresosEgresos").subscribe(({ items }) => {
      this.ingresosEgresos = items
    })
  }

  ngOnDestroy() {
    this.ingresosSubs.unsubscribe()
  }

  borrar(uid: string) {
    this.ies.borrarIngresoEgreso(uid)
      .then(() => Swal.fire("Borrado", "Item borrado", "success")
      )
      .catch(error => {
        Swal.fire("Error", "Item no borrado: " + error, "error")
      })
  }

}
