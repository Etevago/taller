import { takeUntil } from 'rxjs/operators';
import * as ui from './../../shared/ui.actions';
import { AuthService } from './../../services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<void> = new Subject();

  registro: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.registro = this.fb.group({
      nombre: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      pass1: ["", [Validators.required, Validators.minLength(6)]],
      pass2: ["", [Validators.required, Validators.minLength(6)]],
    })

    this.store.select("ui")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(ui =>
        this.loading = ui.isLoading)
  }

  get nombreNoValido() {
    return this.registro.get('nombre').invalid && this.registro.get('nombre').touched
  }

  get emailNoValido() {
    return this.registro.get('email').invalid && this.registro.get('email').touched
  }

  get pass1NoValido() {
    return this.registro.get('pass1').invalid && this.registro.get('pass1').touched
  }

  get pass2NoValido() {
    const pass1 = this.registro.get("pass1").value;
    const pass2 = this.registro.get("pass2").value;
    return ((pass1 === pass2) && pass1.length >=6 && this.registro.get('pass1').touched && this.registro.get('pass2').touched) ? false : true;
  }

  crearUsuario() {
    if (this.registro.invalid || this.pass2NoValido) {
      return
    }
    this.store.dispatch(ui.isLoading())
    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const { nombre, email, pass1 } = this.registro.value
    this.auth.crearUsuario(nombre, email, pass1)
      .then(() => {
        Swal.close()
        this.store.dispatch(ui.stopLoading())
        this.router.navigate(["/"])
      })
      .catch(error => {
        let mensaje;
        if (error.code=="auth/email-already-in-use"){
          mensaje="El email introducido ya está siendo utilizado"
        } 
        else {
          mensaje=error.message
        }
        this.store.dispatch(ui.stopLoading())
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
        })
      })
  }

  estilos() {
    return `
      border-color:green;
      border-width:3px;
    `
  }

  ngOnDestroy() {
    this.unsubscribe.next()
    this.unsubscribe.complete()
  }

}
