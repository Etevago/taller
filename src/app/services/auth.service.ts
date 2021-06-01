import * as auth from './../auth/auth.actions';
import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import "firebase/firestore"
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSub: Subscription;
  private _user: Usuario;

  get user() {
    return this._user
  }

  constructor(public auth: AngularFireAuth, public firestore: AngularFirestore, private store: Store) { }

  initAuthListener() {

    this.auth.authState.subscribe(user => {
      if (user) {
        this.userSub = this.firestore.doc(`${user.uid}/usuario`).valueChanges().subscribe((fireUser: any) => {
          const user = Usuario.fromFirebase(fireUser)
          this._user = user;
          this.store.dispatch(auth.setUser({ user }))
        })
      } else {
        this.userSub?.unsubscribe()
        this._user = null;
        this.store.dispatch(auth.unSetUser())
      }
    })
  }

  isAuth() {
    return this.auth.authState.pipe(
      map(user => user != null)
    )
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {

        const newUser = new Usuario(user.uid, nombre, user.email, 0, 0, false)

        return this.firestore.doc(`${user.uid}/usuario`).set({ ...newUser })

      })
  }

  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  logout() {
    return this.auth.signOut();
  }
}
