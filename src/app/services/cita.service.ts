import { Reparacion } from './../models/reparacion.model';
import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

  uid: string

  constructor(private firestore: AngularFirestore,
    private authService: AuthService) { }

  crearCita(cita: Reparacion[]) {
    const uid = this.authService.user.uid;

    return this.firestore.doc(`${uid}/cita`)
      .collection("items")
      .add({ ...cita });

  }

  borrarCita(idCita: string) {
    const uid = this.authService.user.uid;
    this.firestore.doc(`${uid}/cita/items/${idCita}`)
      .delete()

  }

  initCitaListener(uid: string) {
    return this.firestore.collection(`${uid}/cita/items`)
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
