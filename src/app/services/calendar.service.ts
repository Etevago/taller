import { Fecha } from './../models/fecha.model';
import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearFecha(fecha: Fecha) {
    const uid = this.authService.user.uid;


    return this.firestore.doc(`${uid}/calendar`)
      .collection("items")
      .add({ ...fecha });

  }

  borrarFecha(idFecha: string) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/calendar/items/${idFecha}`)
      .delete()

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
