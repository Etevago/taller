import { isLoading, stopLoading } from './../shared/ui.actions';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>) { }

  ngOnInit() {

    this.loadingSubs = this.store.select('ui')
      .subscribe(({ isLoading }) => this.cargando = isLoading);

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      cantidad: ['', Validators.required],
    });

  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();

  }

  guardar() {
    this.store.dispatch(isLoading())




    if (this.ingresoForm.invalid) { return; }

    this.store.dispatch(ui.isLoading());

    const { descripcion, cantidad } = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, cantidad, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Registro creado', descripcion, 'success');
        this.store.dispatch(stopLoading())

      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', err.message, 'error');
        this.store.dispatch(stopLoading())

      });
  }

}
