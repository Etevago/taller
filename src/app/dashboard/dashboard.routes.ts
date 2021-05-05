import { DetalleComponent } from './../ingreso-egreso/detalle/detalle.component';
import { IngresoEgresoComponent } from './../ingreso-egreso/ingreso-egreso.component';
import { EstadisticaComponent } from './../ingreso-egreso/estadistica/estadistica.component';
import { Routes } from "@angular/router";


export const dashboardRoutes: Routes = [
    { path: 'estadistica', component: EstadisticaComponent },
    { path: 'ingreso-egreso', component: IngresoEgresoComponent },
    { path: 'detalle', component: DetalleComponent },
    { path: '', redirectTo: "estadistica" },

]