import { GraficoComponent } from './../pages/grafico/grafico.component';
import { HistoricoComponent } from './../pages/historico/historico.component';
import { ProgresoComponent } from './../pages/progreso/progreso.component';
import { PagoComponent } from './../pages/pago/pago.component';
import { CitasComponent } from './../pages/citas/citas.component';
import { Routes } from "@angular/router";


export const dashboardRoutes: Routes = [
    { path: 'citas', component: CitasComponent },
    { path: 'pago', component: PagoComponent },
    { path: 'progreso', component: ProgresoComponent },
    { path: 'historico', component: HistoricoComponent },
    { path: 'grafico', component: GraficoComponent },
    { path: '', redirectTo: "citas" },

]