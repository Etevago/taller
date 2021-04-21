import { stopContador } from './../../ingreso-egreso/estadistica/estadistica.actions';
import { DashboardService } from './../../dashboard/dashboard.service';
import { map } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  nombre: string;
  userSub: Subscription;
  reparando: boolean
  constructor(private auth: AuthService, private router: Router, private store: Store<AppState>, private ds: DashboardService) { }

  ngOnInit(): void {

    this.userSub = this.store.select("user")
      .subscribe(({ user }) => this.nombre = user?.nombre);
  }

  ngOnDestroy() {

    this.store.select("contador").subscribe(params => {
      this.reparando = params.reparando
    })
    if (this.reparando){
      this.ds.crearReparacion()
    }
    this.store.dispatch(stopContador())
    this.userSub.unsubscribe()
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(["login"])
    })
  }
}
