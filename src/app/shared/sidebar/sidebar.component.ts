import { stopContador, setContador } from './../../pages/progreso/progreso.actions';
import { DashboardService } from './../../dashboard/dashboard.service';
import {  takeUntil } from 'rxjs/operators';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();
  nombre: string;
  userSub: Subscription;
  reparando: boolean
  constructor(private auth: AuthService, private router: Router, private store: Store<AppState>, private ds: DashboardService) { }

  ngOnInit(): void {

    this.userSub = this.store.select("user")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ user }) => this.nombre = user?.nombre);
  }

  ngOnDestroy() {

    this.store.select("contador").subscribe(params => {
      this.reparando = params.reparando
    })
    if (this.reparando) {
      this.ds.crearReparacion()
    }
    this.store.dispatch(stopContador())
    this.store.dispatch(setContador({ actual: 0 }))

    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(["login"])
    })
  }
}
