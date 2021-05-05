import { MatSelectModule } from '@angular/material/select';
import { DashboardRoutesModule } from './../dashboard/dashboard-routes.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngresoEgresoComponent } from '../ingreso-egreso/ingreso-egreso.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { EstadisticaComponent } from '../ingreso-egreso/estadistica/estadistica.component';
import { DetalleComponent } from '../ingreso-egreso/detalle/detalle.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxPayPalModule } from 'ngx-paypal';
import {  FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { SelectPipe } from '../pipes/select.pipe';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);



@NgModule({
  declarations: [
    DashboardComponent,
    IngresoEgresoComponent,
    EstadisticaComponent,
    DetalleComponent,
    SelectPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    DashboardRoutesModule,
    MatProgressBarModule,
    NgxPayPalModule,
    FullCalendarModule,
    MatSelectModule,
    

  ],
  exports: [

  ]
})
export class IngresoEgresoModule { }
