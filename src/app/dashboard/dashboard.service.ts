import { reparar, stopReparar } from './../pages/progreso/progreso.actions';
import { AppState } from 'src/app/app.reducer';
import { Store } from '@ngrx/store';
import { AuthService } from './../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  contador: number;
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>
  ) { }



  crearReparacion() {
    this.store.select("contador").subscribe((contador) => {
      this.contador = contador.cont
    })

    const uid = this.authService.user.uid

    this.firestore.doc(`${uid}/usuario`).update({ tiempo: new Date().getTime() })
    this.firestore.doc(`${uid}/usuario`).update({ contador: this.contador })
    this.firestore.doc(`${uid}/usuario`).update({ reparando: true })

    this.store.dispatch(reparar())

  }

  reparacionCompleta() {
    const uid = this.authService.user.uid
    this.firestore.doc(`${uid}/usuario`).update({ contador: 100 })
  }

  reparacionReiniciar() {
    const uid = this.authService.user.uid
    this.firestore.doc(`${uid}/usuario`).update({ contador: 0 })
  }

  stopReparacion() {
    const uid = this.authService.user.uid
    this.firestore.doc(`${uid}/usuario`).update({ reparando: false })
    this.store.dispatch(stopReparar())
  }

}
