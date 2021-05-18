import { ProgresoComponent } from './progreso/progreso.component';
import { PagoComponent } from './pago/pago.component';
import { CitasComponent } from './citas/citas.component';
import { MatSelectModule } from '@angular/material/select';
import { DashboardRoutesModule } from '../dashboard/dashboard-routes.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxPayPalModule } from 'ngx-paypal';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
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
    CitasComponent,
    PagoComponent,
    ProgresoComponent,
    SelectPipe,
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
    FormsModule

  ],
  exports: [

  ]
})
export class PagesModule { }
