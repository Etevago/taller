import { AuthGuard } from './../services/auth.guard';
import { dashboardRoutes } from './dashboard.routes';
import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const rutasHijas:Routes=[
  {
    path: '',
    component: DashboardComponent,
    children: dashboardRoutes,
    // canActivate:[AuthGuard]
},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(rutasHijas)
  ],
  exports:[
    RouterModule
  ]
})
export class DashboardRoutesModule { }
