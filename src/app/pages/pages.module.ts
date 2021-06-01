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
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import { SelectPipe } from '../pipes/select.pipe';
import { HistoricoComponent } from './historico/historico.component';
import { ChartsModule } from 'ng2-charts';
import { GraficoComponent } from './grafico/grafico.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    DashboardComponent,
    CitasComponent,
    PagoComponent,
    ProgresoComponent,
    HistoricoComponent,
    SelectPipe,
    GraficoComponent,
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
    FormsModule,
    ChartsModule
  ],
  exports: [

  ]
})
export class PagesModule { }
