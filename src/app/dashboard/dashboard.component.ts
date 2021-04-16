import { setItems } from './../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  sub: Subscription;
  ingresosSubs: Subscription;

  constructor(private store: Store<AppState>, private ies: IngresoEgresoService) { }

  ngOnInit(): void {
    this.sub = this.store.select("user")
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(
        ({ user }) => this.ingresosSubs = this.ies.initIngresoEgresoListener(user.uid)
          .subscribe((ingresosEgresosFB: any) => {
            this.store.dispatch(setItems({ items: ingresosEgresosFB }))
          })
      )
  }

  ngOnDestroy() {
    this.sub?.unsubscribe()
    this.ingresosSubs?.unsubscribe()
  }


}
