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

  crearFecha(fecha) {
    const uid = this.authService.user.uid;

    delete fecha.uid;

    return this.firestore.doc(`${uid}/usuario`)
      .collection('calendar')
      .add({ ...fecha });

  }

  borrarFecha(uidFecha: string) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/usuario/calendar/${uidFecha}`)
      .delete()
  }


  initCalendarListener(uid: string) {
    return this.firestore.collection(`${uid}/usuario/calendar`)
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
