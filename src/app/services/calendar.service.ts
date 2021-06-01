import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Fecha } from './../models/fecha.model';
import { Injectable } from '@angular/core';
import * as Firebase from 'firebase/app';


import 'firebase/firestore' ;
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { AppState } from '../app.reducer';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  uid: string

  constructor(private firestore: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>,
    ) { }

  crearFecha(fecha: Fecha) {
    const uid = this.authService.user.uid;
    return this.firestore.collection(`${uid}/calendar/items`)
      .add({ ...fecha });

  }

  borrarFecha(idFecha: string) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/calendar/${idFecha}`)
      .delete()
  }

  finalizarFecha(idFecha: string) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/calendar/items/${idFecha}`)
      .update({ finalizada: true })
  }

  pagarFecha(idFecha: string) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/calendar/items/${idFecha}`)
      .update({ pagada: true })
  }

  updateVisibles(idFecha: string, nuevo) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/calendar/items/${idFecha}`)
      .update({ visibles: Firebase.default.firestore.FieldValue.arrayUnion(nuevo) })
  }

  initCalendarListener(uid: string) {
    return this.firestore.collection(`${uid}/calendar/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot => {
          return snapshot.map(doc => {
            return {
              uid: doc.payload.doc.id,
              data: doc.payload.doc.data()
            }
          })
        })
      )
  }
}
