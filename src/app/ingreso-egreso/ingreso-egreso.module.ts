import { DashboardRoutesModule } from './../dashboard/dashboard-routes.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoEgresoComponent } from '../ingreso-egreso/ingreso-egreso.component';
import { OrdenIngresoPipe } from '../pipes/orden-ingreso.pipe';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EstadisticaComponent } from '../ingreso-egreso/estadistica/estadistica.component';
import { DetalleComponent } from '../ingreso-egreso/detalle/detalle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { ingresoEgresoReducer } from './ingreso-egreso.reducer';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    OrdenIngresoPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardRoutesModule,
    StoreModule.forFeature("ingresosEgresos", ingresoEgresoReducer),
    MatProgressBarModule


  ],
  exports: [

  ]
})
export class IngresoEgresoModule { }
